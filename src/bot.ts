import TelegramBot, { Message } from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN as string, {polling: true})

bot.on('message', async(msg: Message) => {
    const chatId: number = msg.chat.id;
    const text: string = msg.text || '';

    if (text === '/start') {
        await bot.sendMessage(chatId, "Привет")
    }

    await bot.sendMessage(chatId, `Вы сказали: ${text}`, {
        reply_to_message_id: msg.message_id,
    });

    if (Math.random() < 0.3) {
        await bot.sendMessage(chatId, "test inline keys:", {
            reply_markup: {
                inline_keyboard: [
                    [{text: "1", callback_data: "1"}],
                    [{text: "2", callback_data: "2"}],
                    [{text: "3", callback_data: "3"}],
                ]
            }
        })        
    }

    if (Math.random() > 0.7) {
        await bot.sendMessage(chatId, "test reply keys", 
            {reply_markup: {
                keyboard: [[{text: '⚙️ Настройки',}], [{text: '✅ Подтвердить'}, {text: '❌ Отклонить'}]],
                remove_keyboard: true,
                one_time_keyboard: true
            }}
        )
    }

    console.log(msg)
})

type CallbackData = '1' | '2' | '3'

bot.on('callback_query', async (query) => {
    const data: CallbackData = query.data as CallbackData
    
    if (!query?.message?.chat.id || !data) {
        return;
    }
    const chatId: number = query?.message?.chat.id;

    await bot.answerCallbackQuery(query.id)

    await bot.sendMessage(chatId, `Вы нажали: ${data}`)
})