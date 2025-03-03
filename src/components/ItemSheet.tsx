import { CSSObject } from "@emotion/react";
import React from "react";
import { equipment, mwItem, weapon } from "../constants";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { WeaponSheet } from "./equipment/WeaponSheet";
import { CSSReset } from "./CSSReset";
import { MwItemSheet } from "./equipment/MwItemSheet";
import { ThrowError } from "./ThrowError";
import { PersonalDetailSheet } from "./personalDetails/PersonalDetailSheet";
import { isAbilityItem, isMwItem } from "../v10Types";

type ItemSheetProps = {
  item: InvestigatorItem;
  application: ItemSheet;
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const ItemSheet: React.FC<ItemSheetProps> = ({ item, application }) => {
  const theme = item.getTheme();

  const style: CSSObject =
    isAbilityItem(item) || isMwItem(item)
      ? {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }
      : {
          position: "relative",
        };

  return (
    <CSSReset theme={theme} mode="small" css={style}>
      {isAbilityItem(item) ? (
        <AbilitySheet ability={item} application={application} />
      ) : item.type === equipment ? (
        <EquipmentSheet equipment={item} application={application} />
      ) : item.type === weapon ? (
        <WeaponSheet weapon={item} application={application} />
      ) : item.type === mwItem ? (
        <MwItemSheet item={item} application={application} />
      ) : item.type === "personalDetail" ? (
        <PersonalDetailSheet personalDetail={item} application={application} />
      ) : (
        <ThrowError message={`No sheet defined for item type ${item.type}`} />
      )}
    </CSSReset>
  );
};
