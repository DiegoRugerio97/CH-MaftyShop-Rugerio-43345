import { messageModel } from './models/message.model.js'

class MessageManager {

    async createMessage(user, message) {
        /**
        * Creates new Message doc in MongoDB 
        */
        const response = await messageModel.create({ user: user, message: message })
        return response
    }

    async getMessages() {
        /**
        * Returns the Messages docs from MongoDB
        */

        const query = messageModel.find().lean()
        return await query.exec()
    }

}

export default MessageManager