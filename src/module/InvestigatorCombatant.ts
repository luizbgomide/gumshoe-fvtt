import { ConfiguredDocumentClass } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import * as constants from "../constants";
import { isGeneralAbilityDataSource, isPCDataSource } from "../types";
import { GumshoeItem } from "./GumshoeItem";

/**
 * Override base Combatant class to override the initiative formula.
 * XXX what's i'd like to do is block it from doing a "roll" at all.
 */
export class InvestigatorCombatant extends Combatant {
  _getInitiativeFormula () {
    if (this.actor?.data.type !== constants.pc) {
      return "0";
    }
    const abilityName = this.actor?.data.data.initiativeAbility;
    const ability = this.actor.items.find(
      (item: GumshoeItem) => item.type === constants.generalAbility && item.name === abilityName,
    );
    if (ability && ability.data.type === constants.generalAbility) {
      const score = ability.data.data.rating.toString();
      return score;
    } else {
      return "0";
    }
  }
}

/**
 * Override base Combat so we can do custom GUMSHOE-style initiative
 */
export class InvestigatorCombat extends Combat {
  protected _sortCombatants (
    a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
    b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  ): number {
    if (!(a.actor !== null && b.actor !== null && isPCDataSource(a.actor?.data) && isPCDataSource(b.actor?.data))) {
      return 0;
    }
    const aAbilityName = a.actor.data.data.initiativeAbility;
    const aAbility = a.actor.items.find(
      (item: GumshoeItem) => item.type === constants.generalAbility && item.name === aAbilityName,
    );
    const bAbilityName = b.actor.data.data.initiativeAbility;
    const bAbility = b.actor.items.find(
      (item: GumshoeItem) => item.type === constants.generalAbility && item.name === bAbilityName,
    );
    // working out initiative - "goes first" beats non-"goes first"; then
    // compare ratings, then compare pools.
    if (!(aAbility !== undefined && bAbility !== undefined && isGeneralAbilityDataSource(aAbility.data) && isGeneralAbilityDataSource(bAbility.data))) {
      return 0;
    }
    if (aAbility.data.data.goesFirstInCombat && !bAbility.data.data.goesFirstInCombat) {
      return -1;
    } else if (!aAbility.data.data.goesFirstInCombat && bAbility.data.data.goesFirstInCombat) {
      return 1;
    } else {
      const aRating = aAbility.data.data.rating;
      const bRating = bAbility.data.data.rating;
      const aPool = aAbility.data.data.pool;
      const bPool = bAbility.data.data.pool;
      if (aRating < bRating) {
        return 1;
      } else if (aRating > bRating) {
        return -1;
      } else if (aPool < bPool) {
        return 1;
      } else if (aPool > bPool) {
        return -1;
      } else {
        return 0;
      }
    }
  }
}
