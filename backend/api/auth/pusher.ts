import { Router, type Response, type Request } from "express";
import { db } from "../../src/prisma/db";
import requireAuth from "../../middleware/authentication";
import { pusher } from "../../utils";

const router = Router();

router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response<unknown, { user: { id: number } }>) => {
    const { socket_id: socketId, channel_name: channel } = req.body;
    const userId = res.locals.user.id;

    if (typeof socketId !== "string" || typeof channel !== "string") {
      return res.status(400).json({ error: "Invalid channel auth request" });
    }

    try {
      const userMatch = /^private-user-([1-9]\d*)$/.exec(channel);
      const rideMatch = /^private-ride-([1-9]\d*)$/.exec(channel);

      if (userMatch) {
        const channelUserId = Number(userMatch[1]);

        if (channelUserId !== userId) {
          return res.status(403).json({ error: "Forbidden" });
        }
      } else if (rideMatch) {
        const rideId = Number(rideMatch[1]);

        if (!Number.isInteger(rideId) || rideId > 2147483647) {
          return res.status(400).json({ error: "Invalid ride ID" });
        }

        const ride = await db.orm.public.Ride.first({ id: rideId });

        if (!ride) {
          return res.status(404).json({ error: "Ride not found" });
        }

        if (userId !== ride.posterId && userId !== ride.acceptorId) {
          return res.status(403).json({ error: "Forbidden" });
        }
      } else {
        return res.status(403).json({ error: "Unsupported channel" });
      }

      return res.json(pusher.authorizeChannel(socketId, channel));
    } catch (error) {
      console.error("Error authorizing Pusher channel:", error);
      return res.status(500).json({ error: "Unable to authorize channel" });
    }
  },
);

export default router;
