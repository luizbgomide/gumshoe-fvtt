// import ReactDOM from "react-dom";
import React from "react";
import { NPCSheet } from "../components/characters/NPCSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class InvestigatorNPCSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 700,
      height: 660,
    });
  }
}

const render = (sheet: InvestigatorNPCSheetClassBase) => {
  return (
    <NPCSheet
      actor={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorNPCSheetClass = ReactApplicationMixin(
  InvestigatorNPCSheetClassBase,
  render,
);
