import {Markup} from "telegraf";

export function getMainKeyboard(accessGroups) {
    return Markup.keyboard([[
        Markup.button.callback('Адміни', 'adminsList'),
        Markup.button.callback('Суперадміни', 'superAdminsList'),
    ],
        [Markup.button.callback('Додати', 'addAdmin')]
    ])
}