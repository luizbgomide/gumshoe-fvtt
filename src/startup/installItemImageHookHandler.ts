import {
  equipmentIcon,
  generalAbilityIcon,
  investigativeAbilityIcon,
  weaponIcon,
  personalDetailIcon,
} from "../constants";
import { assertGame, isNullOrEmptyString } from "../functions";
import {
  isEquipmentItem,
  isGeneralAbilityItem,
  isPersonalDetailItem,
  isWeaponItem,
} from "../v10Types";

export const installItemImageHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    (
      item: Item,
      createData: { name: string; type: string; data?: any; img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // set image
      if (
        isNullOrEmptyString(item.data.img) ||
        item.data.img === "icons/svg/item-bag.svg"
      ) {
        item.data.update({
          img: isWeaponItem(item)
            ? weaponIcon
            : isEquipmentItem(item)
            ? equipmentIcon
            : isGeneralAbilityItem(item)
            ? generalAbilityIcon
            : isPersonalDetailItem(item)
            ? personalDetailIcon
            : investigativeAbilityIcon,
        });
      }
    },
  );
};
