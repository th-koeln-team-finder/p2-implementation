import {ProjectSkillInsert, SkillInsert, SkillSelect, UserSkillInsert} from "@/schema";
import {faker} from "@faker-js/faker/locale/de";

export function makeSkill(amount:number): SkillSelect[]{
    let skill:SkillSelect[]=[]

    Array.from({length:amount},()=>{
        skill.push({
            name:faker.person.jobArea(),
            id:faker.number.int()
        })
    })
    return skill
}

export function makeProjectSkills(projectID:number, amount:number):ProjectSkillInsert[]{
    const skills = makeSkill(amount)



   let projectSkills:ProjectSkillInsert[]=[]
skills.map((skill)=>{
    projectSkills.push({
        projectId:projectID,
        skillId:skill.id,
        level: faker.number.int(10)
    })
})
    return projectSkills
}
export function makeUserSkill(amount:number, UserId:number) :UserSkillInsert[]{
    const skills = makeSkill(amount)
    let userSkills:UserSkillInsert[]=[]
    skills.map((skill)=>{
        userSkills.push({
            UserId:UserId,
            skillId:skill.id,
            level:faker.number.int(10)
        })
    })
    return userSkills
}