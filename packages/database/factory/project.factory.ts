import {ProjectInsert} from "../schema";
import {faker} from "@faker-js/faker/locale/de";

export function makeProject(): ProjectInsert {
     enum a {open="open",
            closed="closed"}
  return {
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
      status : faker.helpers.enumValue(a),

  }
}