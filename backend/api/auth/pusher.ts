import { Router, type Response, type Request } from "express";
import { db } from "../../src/prisma/db";
import requireAuth from "../../middleware/authentication";
import { pusher } from "../../utils";

const router = Router();

router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response<unknown, { user: { id: number } }>) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;

    const rideId = Number(channel.split("-").pop());

    if (!Number.isInteger(rideId) || rideId < 1 || rideId > 2147483647) {
      return res.status(400).json({ error: "Invalid ride ID" });
    }

    const ride = await db.orm.public.Ride.first({ id: rideId });

    if (!ride) return res.status(404).json({ error: "Ride doesn't exist" });

    const userId = res.locals.user.id;

    if (userId !== ride.acceptorId && userId !== ride.posterId)
      return res.status(403).send("forbidden");

    const authResponse = pusher.authorizeChannel(socketId, channel);
    res.send(authResponse);
  },
);

export default router;
