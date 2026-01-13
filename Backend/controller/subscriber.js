import Subscriber from "../schema/Subscriber.js";

class SubscriberController {

    // Add Subscriber
    async addSubscriber(req, res) {
        console.log("Received subscription request:", req.body);
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).send({ message: 'Email is required' });
            }

            // Check if exists
            const existing = await Subscriber.findOne({ email });
            if (existing) {
                return res.status(200).send({ message: 'Email already subscribed' });
            }

            const newSub = new Subscriber({ email });
            await newSub.save();
            res.status(200).send({ message: 'Subscription successful' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }

    // Get Subscribers
    async getSubscribers(req, res) {
        try {
            const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
            res.status(200).send(subscribers);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }

    // Delete Subscriber
    async deleteSubscriber(req, res) {
        try {
            const { id } = req.body;
            await Subscriber.findByIdAndDelete(id);
            res.status(200).send({ message: 'Subscriber removed' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
}

export default SubscriberController;
