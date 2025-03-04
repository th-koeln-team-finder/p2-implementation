import {faker} from '@faker-js/faker/locale/de'
import type {UserInsert} from '../schema'

export function makeUser(): UserInsert {
  return {
    name: faker.internet.username(),
    email: faker.internet.email(),
    roles: ['default-user'],
    bio: JSON.stringify({
      "root": {
        "children": [{
          "children": [{
            "detail": 0,
            "format": 2,
            "mode": "normal",
            "style": "",
            "text": "[Verse 1]",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 2,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "I threw a wish in the well",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Don't ask me, I'll never tell",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "I looked to you as it fell",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "And now you're in my way",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "I trade my soul for a wish",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Pennies and dimes for a kiss",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "I wasn't lookin' for this",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "But now you're in my way",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [],
          "direction": null,
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 2,
            "mode": "normal",
            "style": "",
            "text": "[Pre-Chorus]",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 2,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Your stare was holdin'",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Ripped jeans, skin was showin'",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Hot night, wind was blowin'",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Where you think you're goin', baby?",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [],
          "direction": null,
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 2,
            "mode": "normal",
            "style": "",
            "text": "[Chorus]",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 2,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Hey, I just met you, and this is crazy",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "But here's my number, so call me maybe",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "It's hard to look right at you, baby",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "But here's my number, so call me maybe",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Hey, I just met you, and this is crazy",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "But here's my number, so call me maybe",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "And all the other boys try to chase me",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }, {
          "children": [{
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "But here's my number, so call me maybe",
            "type": "text",
            "version": 1
          }],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "type": "paragraph",
          "version": 1,
          "textFormat": 0,
          "textStyle": ""
        }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1
      }
    }),
  }
}
