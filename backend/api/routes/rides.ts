import { Router, type Request, type Response } from "express";
import { inputRideSchema, type rideInputType } from "../../schema";
import { db } from "../../src/prisma/db";
import requireAuth from "../../middleware/authentication";
import validateBody from "../../middleware/validation";
import { pusher } from "../../utils";
import { or } from "@prisma/orm-postgres/orm-client";

const router = Router();

interface RideBodyLocals {
  user: { id: number };
  validatedBody: rideInputType;
}

router.get("/", async (_req, res) => {
  try {
    const rides = await db.orm.public.Ride.all();
    res.json(rides);
  } catch (error) {
    console.error("Error getting rides:", error);
    res.status(500).json({ error: "Unable to fetch rides" });
  }
});

router.get(
  "/my-rides",
  requireAuth,
  async (_req, res: Response<unknown, { user: { id: number } }>) => {
    const userId = res.locals.user.id;

    try {
      const rides = await db.orm.public.Ride.where((ride) =>
        or(ride.posterId.eq(userId), ride.acceptorId.eq(userId)),
      ).all();

      return res.json(rides);
    } catch (error) {
      console.error("Error getting my rides:", error);
      return res.status(500).json({ error: "Unable to fetch rides" });
    }
  },
);

router.post(
  "/",
  [requireAuth, validateBody(inputRideSchema)],
  async (_req: Request, res: Response<unknown, RideBodyLocals>) => {
    const {
      user: { id: userId },
      validatedBody: validated,
    } = res.locals;

    try {
      const createdRide = await db.orm.public.Ride.create({
        ...validated,
        posterId: userId,
      });

      res.status(201).json(createdRide);
    } catch (error) {
      console.error("Error creating ride:", error);
      res.status(500).json({ error: "Unable to create ride" });
    }
  },
);

router.get("/:rideId", async (req, res) => {
  const rideId = Number(req.params.rideId);

  if (!Number.isInteger(rideId) || rideId < 1 || rideId > 2147483647) {
    res.status(400).json({ error: "Invalid ride ID" });
    return;
  }

  try {
    const ride = await db.orm.public.Ride.first({ id: rideId });

    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    res.json(ride);
  } catch (error) {
    console.error("Error getting ride:", error);
    res.status(500).json({ error: "Unable to get ride" });
  }
});

//send request with default current values to reuse inputRideSchema
router.put(
  "/:rideId",
  [requireAuth, validateBody(inputRideSchema)],
  async (req: Request, res: Response<unknown, RideBodyLocals>) => {
    const rideId = Number(req.params.rideId);

    if (!Number.isInteger(rideId) || rideId < 1 || rideId > 2147483647)
      return res.status(400).send({ error: "Invalid ride Id" });

    const {
      user: { id: userId },
      validatedBody: validated,
    } = res.locals;

    try {
      const ride = await db.orm.public.Ride.first({ id: rideId });
      if (!ride) return res.status(404).send({ error: "ride not found" });

      if (ride.posterId !== userId)
        return res.status(403).send("Cannot update a ride you did not post");

      const updatedRide = await db.orm.public.Ride.where({ id: rideId }).update(
        validated,
      );

      res.send(updatedRide);
    } catch (error) {
      console.error("Error updating ride:", error);
      res.status(500).json({ errors: "Unable to update ride" });
    }
  },
);

router.post("/:rideId/accept", requireAuth, async (req, res) => {
  const rideId = Number(req.params.rideId);

  if (!Number.isInteger(rideId) || rideId < 1 || rideId > 2147483647) {
    return res.status(400).json({ error: "Invalid ride ID" });
  }

  const userId = res.locals.user.id;

  try {
    const ride = await db.orm.public.Ride.first({ id: rideId });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.posterId === userId) {
      return res.status(409).json({ error: "Cannot accept your own ride" });
    }

    const updatedRide = await db.orm.public.Ride.where({
      id: rideId,
      status: "OPEN",
    }).update({
      acceptorId: userId,
      status: "ACCEPTED",
    });

    if (!updatedRide) {
      return res.status(409).json({
        error: "Ride is no longer available",
      });
    }

    // The ride is accepted even if its notification cannot be published.
    try {
      await pusher.trigger(`private-user-${ride.posterId}`, "ride-accepted", {
        type: "ride-accepted",
      });
    } catch (error) {
      console.error("Unable to publish ride acceptance notification:", {
        rideId,
        posterId: ride.posterId,
        error,
      });
    }
    return res.status(200).json(updatedRide);
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Unable to accept ride" });
  }
});

router.delete("/:rideId", requireAuth, async (req, res) => {
  const rideId = Number(req.params.rideId);

  if (!Number.isInteger(rideId) || rideId < 1 || rideId > 2147483647) {
    return res.status(400).json({ error: "Invalid ride ID" });
  }

  const userId = res.locals.user.id;

  try {
    const ride = await db.orm.public.Ride.first({ id: rideId });
    if (!ride) return res.status(404).send({ error: "ride not found" });

    if (ride.posterId !== userId)
      return res.status(403).send("Cannot delete a ride you did not post");

    await db.orm.public.Ride.where({
      id: rideId,
    }).delete();

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting ride:", error);
    return res.status(500).json({ error: "Unable to delete ride" });
  }
});

export default router;
