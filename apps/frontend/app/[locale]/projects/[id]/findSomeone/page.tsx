


import {getTranslations} from "next-intl/server";

import {FindSomeoneBar} from "@/features/projects/components/FindSomeone/FindSomeoneBar";
import {FindSomeoneList} from "@/features/projects/components/FindSomeone/FindSomeoneList";

export default async function findSomeone(){
const translate = await getTranslations('findSomeone')
    return (
        <div className="container mx-auto px-4">
            <h1 className="mb-4 font-semibold text-4xl">{translate('pageTitle')}</h1>
            <FindSomeoneList/>


        </div>
    )}
