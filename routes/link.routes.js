const {Router} = require('express')
const router = Router()
const Link = require('../models/Link.js')
const auth = require('../middleware/auth.middleware')
const config = require("config");
const shortId = require('shortid')


router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        //берем ссылку с запроса
        const {from} = req.body
        //переменная для сокращения кода
        const code = shortId.generate()
        //проверяем или есть уже такая ссылка
        const existing = await Link.findOne({from})
        //если есть передаем в ответ
        if(existing) {
            return res.json({link: existing})
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({
            code, to, from, owner: req.user.userId
        })
        await link.save()

        res.status(201).json({link})


      } catch (e) {
        console.log("e = from link.routes", e)
        res.status(500).json({
          message: "Что-то пошло не так ..",
        });
      }
})

router.get('/', auth, async (req, res) => {
    try {
       const links = await Link.find({owner: req.user.userId}) // ??(auth) req.user.userId добываем через middleware используя jwtToken
       res.json(links)
    } catch (e) {
      console.log("e = from link.routes", e)
      res.status(500).json({
        message: "Что-то пошло не так ..",
      });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
         const link = await Link.findById(req.params.id) 
         res.json(link)
    } catch (e) {
      console.log("e = from link.routes", e)
      res.status(500).json({
        message: "Что-то пошло не так ..",
      });
    }
})

module.exports = router