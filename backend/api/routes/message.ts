import { Router, type Request, type Response } from "express";
import requireAuth from "../../middleware/authentication";
import validateBody from "../../middleware/validation";
import { messageSchema, type messageSchemaType } from "../../schema";
import { db } from "../../src/prisma/db";

const router = Router();

interface UserBodyLocals {
  user: { id: number };
  validatedBody: messageSchemaType;
}

router.get(
  "/:rideId",
  requireAuth,
  async (req: Request, res: Response<unknown, { user: { id: number } }>) => {
    const rideId = Number(req.params.rideId);

    if (!Number.isInteger(rideId) || rideId < 1 || rideId > 2147483647) {
      return res.status(400).json({ error: "Invalid ride ID" });
    }

    const userId = res.locals.user.id;

    try {
      const ride = await db.orm.public.Ride.first({ id: rideId });

      if (!ride) return res.status(404).send("Ride doesn't exist");

      if (userId !== ride.acceptorId && userId !== ride.posterId)
        return res.status(403).send("Cannot fetch messages for this ride");

      const messages = await db.orm.public.Message.where({ rideId })
        .orderBy([(m) => m.createdAt.asc(), (m) => m.id.asc()])
        .all();

      res.send(messages);
    } catch (error) {
      console.log(`Error getting messages for ride ${rideId}`, error);
      res.status(500).send({ error: "Unable to get messages" });
    }
  },
);

router.post(
  "/",
  [requireAuth, validateBody(messageSchema)],
  async (_req: Request, res: Response<unknown, UserBodyLocals>) => {
    const {
      user: { id: senderId },
      validatedBody: { rideId, content },
    } = res.locals;

    //get the ride and ensure the sender can write messages to this ride
    try {
      const ride = await db.orm.public.Ride.first({ id: rideId });

      if (!ride) return res.status(404).send("Ride does not exist");

      if (senderId !== ride.posterId && senderId !== ride.acceptorId)
        return res.status(403).send("Cannot send a message to this ride");

      if (ride.status !== "ACCEPTED" || ride.acceptorId === null) {
        return res.status(409).json({
          error: "Ride must have an acceptor before messaging",
        });
      }

      const receiverId =
        senderId === ride.posterId ? ride.acceptorId : ride.posterId;

      const message = await db.orm.public.Message.create({
        content,
        rideId,
        receiver_id: receiverId,
        sender_id: senderId,
      });

      res.status(201).send(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Unable to create message" });
    }
  },
);
export default router;
