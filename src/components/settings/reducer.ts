import { PresetV1 } from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { SettingsDict } from "../../settings";

type AnyAction = {
  type: string,
  payload?: unknown,
}

function createAction<P = void> (type: string) {
  const create = (payload: P) => ({ type, payload });
  const match = (action: AnyAction): action is { type: string, payload: P } =>
    action.type === type;
  return { create, match };
}

export const addCategory = createAction("addCategory");
export const deleteCategory = createAction<{idx: number}>("deleteCategory");
export const addField = createAction<{categoryIdx: number}>("addField");
export const deleteField = createAction<{categoryIdx: number, fieldIdx: number}>("deleteField");
export const setAll = createAction<{newSettings: SettingsDict}>("setAll");
export const renameCategory = createAction<{idx: number, newName: string}>("renameCategory");
export const applyPreset = createAction<{preset: PresetV1, presetId: string}>("applyPreset");

export const reducer = (state: SettingsDict, action: AnyAction): SettingsDict => {
  const newState = { ...state };
  if (setAll.match(action)) {
    return action.payload.newSettings;
  } else if (applyPreset.match(action)) {
    return {
      // start with the current temp settings - this way we keep any values
      // not handled by the presets
      ...state,
      // now we layer in a safe default. This is typed as Required<> so it
      // will always contain one of everything that can be controlled by a
      // preset.
      ...pathOfCthulhuPreset,
      // now layer in the actual preset
      ...action.payload.preset,
      // and finally, set the actual preset id
      systemPreset: action.payload.presetId,
    };
  } else if (addCategory.match(action)) {
    newState.equipmentCategories = [
      ...state.equipmentCategories,
      { name: "", fields: [] },
    ];
  } else if (deleteCategory.match(action)) {
    const newCats = [...state.equipmentCategories];
    newCats.splice(action.payload.idx, 1);
    newState.equipmentCategories = newCats;
  } else if (renameCategory.match(action)) {
    const newCats = [...state.equipmentCategories];
    newCats[action.payload.idx].name = action.payload.newName;
    newState.equipmentCategories = newCats;
  } else if (addField.match(action)) {
    const newCats = [...state.equipmentCategories];
    newCats[action.payload.categoryIdx].fields =
      newCats[action.payload.categoryIdx].fields === undefined
        ? []
        : newCats[action.payload.categoryIdx].fields;
    newCats[action.payload.categoryIdx].fields?.push({ name: "", type: "string", default: "" });
    newState.equipmentCategories = newCats;
  } else if (deleteField.match(action)) {
    const newCats = [...state.equipmentCategories];
    newCats[action.payload.categoryIdx].fields?.splice(action.payload.fieldIdx, 1);
    newState.equipmentCategories = newCats;
  }

  return newState;
};
