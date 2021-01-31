/** @jsx jsx */
import React, { Fragment, useCallback, useContext } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./abilities/PoolTracker";
import { jsx } from "@emotion/react";
import { useUpdate } from "../hooks/useUpdate";
import { AbilitiesArea } from "./abilities/AbilitiesArea";
import { CSSReset } from "./CSSReset";
import { TrailLogoEditable } from "./TrailLogoEditable";
import { InputGrid } from "./inputs/InputGrid";
import { GridField } from "./inputs/GridField";
import { AsyncTextInput } from "./inputs/AsyncTextInput";
import { TabContainer } from "./TabContainer";
import { EquipmentArea } from "./equipment/EquipmentArea";
import { NotesArea } from "./NotesArea";
import { WeaponsArea } from "./equipment/WeaponsArea";
import { ThemeContext } from "../theme";

type TrailActorSheetProps = {
  entity: TrailActor,
  foundryWindow: Application,
}

export const TrailActorSheet = ({
  entity,
  foundryWindow,
}: TrailActorSheetProps) => {
  const onImageClick = useCallback(() => {
    console.log("onImageClick");
    const fp = new FilePicker({
      type: "image",
      current: entity.data.img,
      callback: (path) => {
        entity.update({
          img: path,
        });
      },
      top: foundryWindow.position.top + 40,
      left: foundryWindow.position.left + 10,
    });
    // types aren't quite right for fp
    return (fp as any).browse();
  }, [entity, foundryWindow.position.left, foundryWindow.position.top]);

  const updateName = useUpdate(entity, name => ({ name }));
  const updateDrive = useUpdate(entity, drive => ({ data: { drive } }));
  const updateOccupation = useUpdate(entity, occupation => ({ data: { occupation } }));

  const [theme] = useContext(ThemeContext);

  return (
    <CSSReset
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "grid",
        gridTemplateRows: "min-content max-content 1fr",
        gridTemplateColumns: "10em 1fr 10em",
        gap: "0.5em",
        gridTemplateAreas:
          "\"title title image\" " +
          "\"pools stats image\" " +
          "\"pools body  body\" ",
      }}
    >

      <div
        css={{
          gridArea: "title",
          textAlign: "center",
          // backgroundColor: "rgba(255,255,255, 0.3)",
          backgroundImage: `radial-gradient(closest-side, ${theme.colors.thick} 0%, rgba(255,255,255,0) 100%)`,
        }}
      >
        <TrailLogoEditable
          text={entity.data.name}
          subtext={entity.data.data.occupation}
          defaultSubtext="Investigator"
          onChangeText={updateName}
          onChangeSubtext={updateOccupation}
        />
      </div>
      <div
        css={{
          gridArea: "image",
          backgroundImage: `url(${entity.data.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0.2em",
          boxShadow: "0em 0em 0.5em 0.1em rgba(0,0,0,0.5)",
          transform: "rotateZ(2deg)",
        }}
        onClick={onImageClick}
      />

      <div
        css={{
          gridArea: "stats",
          padding: "1em",
        }}
      >
        <InputGrid>
        <GridField label="Name">
            <AsyncTextInput
              value={entity.data.name}
              onChange={updateName}
            />
          </GridField>
          <GridField label="Occupation">
            <AsyncTextInput
              value={entity.data.data.occupation}
              onChange={updateOccupation}
            />
          </GridField>
          <GridField label="Drive">
            <AsyncTextInput
              value={entity.data.data.drive}
              onChange={updateDrive}
            />
          </GridField>
        </InputGrid>
      </div>

      <div
        css={{
          gridArea: "pools",
          position: "relative",
          overflowX: "visible",
          overflowY: "auto",
          padding: "1em",
          background: theme.colors.medium,
        }}
        >

          <button onClick={entity.confirmRefresh}>
            Refresh
          </button>
          <hr/>

          <PoolTracker abilityName="Sanity" actor={entity} />
          <PoolTracker abilityName="Stability" actor={entity} />
          <PoolTracker abilityName="Health" actor={entity} />
          <PoolTracker abilityName="Magic" actor={entity} />
          <hr/>
          <button onClick={entity.confirmNuke}>
            Nuke
          </button>
      </div>

      <div
        css={{
          gridArea: "body",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TabContainer
          defaultTab="abilities"
          tabs={[
            {
              id: "abilities",
              label: "Abilities",
              content: <AbilitiesArea actor={entity}/>,
            },
            {
              id: "equipment",
              label: "Equipment",
              content: (
                <Fragment>
                  <WeaponsArea actor={entity} />
                  <div css={{ height: "1em" }}/>
                  <EquipmentArea actor={entity} />
                </Fragment>
              ),
            },
            {
              id: "notes",
              label: "Notes",
              content: (
                <NotesArea actor={entity} />
              ),
            },
          ]}
        />
      </div>
    </CSSReset>
  );
};
