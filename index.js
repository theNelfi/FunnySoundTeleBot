const Telegraf = require('telegraf')
const fs = require('fs')

const sounds = JSON.parse(fs.readFileSync('sounds.json', 'utf8')).sounds

const app = new Telegraf('476485704:AAGFiKnpMKMab28f-coBacJa9KdPZ-ETFAE')

app.telegram.getMe().then((bot_informations) => {
  app.options.username = bot_informations.username;
  console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});

app.command('start', ({ from, reply}) => {
  console.log('start', from)
  return reply(`Welcome! My name is FunnySoundBot. I\'m the Telegram bot. I can reply to your friend with different funny sounds and work in inline mode.
  You just need to type \'@FunnySoundBot (name of a sound)\' in the chat with your friend and choose a sound from the list.
  To know about my commands, enter \'/help\'.`)
})

app.command('help', ({ from, reply}) => {
  return reply(`List of my commands:
  /start - start working with me;
  /help - get some help;
  /sound - get a random funny sound.`)
})

app.command('sound', (ctx) => {
  let num = Math.round(Math.random() * (sounds.length - 1))
  return ctx.replyWithAudio(sounds[num].url)
})

app.on('sticker', (ctx) => {
  ctx.reply('Are you joking? Hah, that\'s funny.')
})

app.on('inline_query', (ctx) => {
  let results = []
  let soundquery = ctx.update.inline_query.query;
  for (let soundIndex = 0; soundIndex < sounds.length; soundIndex++) {
    let sound = sounds[soundIndex]
    if (soundquery && sound.title.toLowerCase().includes(soundquery.toLowerCase())) {
      const result = {
        type: 'audio',
        id: sound.id,
        title: sound.title,
        caption: sound.caption,
        audio_url: sound.url,
        input_message_content: {
          message_text: "Download: " + sound.url
        }
      }
      results.push(result)
    }
  }
  ctx.answerInlineQuery(results.length <= 10 ? results : results.slice(0, 9), {cache_time: 0})
})

app.catch((err) => {
  console.log('Error: ', err)
})

app.startPolling()