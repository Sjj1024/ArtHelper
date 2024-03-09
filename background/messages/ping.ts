import type { PlasmoMessaging } from '@plasmohq/messaging'

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const message = 'Hello from CSDN Plugin'
    console.log('ping 收到消息', req.body)
    res.send({
        message,
    })
}
export default handler
