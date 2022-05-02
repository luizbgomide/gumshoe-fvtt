/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import React, { Fragment, MouseEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { assertGame, assertNotNull } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombatTrackerBase } from "../../module/InvestigatorCombatTracker";

interface CombatTrackerProps {
  app: InvestigatorCombatTrackerBase;
  serial: number;
}

export const CombatTrackerDisplay: React.FC<CombatTrackerProps> = ({
  app,
  serial,
}: CombatTrackerProps) => {
  assertGame(game);
  const user = game.user;
  assertNotNull(user);
  const [data, setData] = useState<CombatTracker.Data | null>(null);
  const dataRef = useRefStash(data);

  // shenangigans with serial number to get a hint from foundry that it's time
  // to fetch new data. getData is async so it's hard to actually use it to
  // trigger renders. See InvestigatorCombatTracker and ReactApplicationMixin.
  useEffect(() => {
    (async () => {
      const data = await app.getData();
      setData(data);
    })();
  }, [app, serial]);

  const _onCombatCreate = useCallback(async (event: MouseEvent) => {
    assertGame(game);
    event.preventDefault();
    const scene = game.scenes?.current;
    const cls = getDocumentClass("Combat");
    const combat = await cls.create({ scene: scene?.id });
    await combat?.activate({ render: false });
  }, []);

  const showConfig = useCallback((ev: MouseEvent) => {
    ev.preventDefault();
    // @ts-expect-error CombatTrackerConfig is fine with no args
    new CombatTrackerConfig().render(true);
  }, []);

  const _onCombatCycle = useCallback(async (event) => {
    assertGame(game);
    event.preventDefault();
    const btn = event.currentTarget;
    const combat = game.combats?.get(btn.dataset.combatId);
    if (!combat) return;
    await combat.activate({ render: false });
  }, []);

  const _onCombatControl = useCallback(async (event: MouseEvent) => {
    event.preventDefault();
    const combat = dataRef.current?.combat;
    const ctrl = event.currentTarget;
    if (ctrl.getAttribute("disabled")) return;
    // @ts-expect-error wtf
    else ctrl.setAttribute("disabled", true);
    // @ts-expect-error this is waaay too funky
    const fn = combat?.[ctrl.dataset.control ?? ""];
    if (fn) await fn.bind(combat)();
    ctrl.removeAttribute("disabled");
  }, [dataRef]);

  const _onToggleDefeatedStatus = useCallback(async (combatant: Combatant) => {
    const isDefeated = !combatant.isDefeated;
    await combatant.update({ defeated: isDefeated });
    const token = combatant.token;
    if (!token) return;
    // Push the defeated status to the token
    const status = CONFIG.statusEffects.find(e => e.id === CONFIG.Combat.defeatedStatusId);
    if (!status && !token.object) return;
    const effect = token.actor && status ? status : CONFIG.controlIcons.defeated;
    // @ts-expect-error not sure if fvtt-types is wrong or what
    if (token.object) await token.object.toggleEffect(effect, { overlay: true, active: isDefeated });
    // @ts-expect-error not sure if fvtt-types is wrong or what
    else await token.toggleActiveEffect(effect, { overlay: true, active: isDefeated });
  }, []);

  const _onCombatantControl = useCallback(async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const li = btn.closest(".combatant");
    const combat = dataRef.current?.combat;
    // @ts-expect-error wtf
    const combatantId = li?.dataset.combatantId;
    const combatant = combat?.combatants.get(combatantId);

    // Switch control action
    // @ts-expect-error wtf
    switch (btn?.dataset.control) {
      // Toggle combatant visibility
      case "toggleHidden":
        return combatant?.update({ hidden: !combatant?.hidden });

      // Toggle combatant defeated flag
      case "toggleDefeated":
        if (combatant) {
          return _onToggleDefeatedStatus(combatant);
        }
        break;
      // Roll combatant initiative
      case "rollInitiative":
        return combat?.rollInitiative([combatant?.id ?? ""]);
    }
  }, [_onToggleDefeatedStatus, dataRef]);

  const localize = game.i18n.localize.bind(game.i18n);

  if (data === null) {
    return null;
  }

  return (
    <Fragment>
      <header id="combat-round">
        {user.isGM && (
          <nav className="encounters flexrow">
            <a
              className="combat-create"
              title={localize("COMBAT.Create")}
              onClick={_onCombatCreate}
            >
              <i className="fas fa-plus"></i>
            </a>
            {data?.combatCount && (
              <Fragment>
                <a
                  className="combat-cycle"
                  title={localize("COMBAT.EncounterPrevious")}
                  {...(data.previousId
                    ? { "data-combat-id": data.previousId }
                    : { disabled: true })}
                  onClick={_onCombatCycle}
                >
                  <i className="fas fa-caret-left"></i>
                </a>
                <h4 className="encounter">
                  {localize("COMBAT.Encounter")} {data.currentIndex} /{" "}
                  {data.combatCount}
                </h4>
                <a
                  className="combat-cycle"
                  title={localize("COMBAT.EncounterNext")}
                  {...(data.nextId
                    ? { "data-combat-id": data.nextId }
                    : { disabled: true })}
                    onClick={_onCombatCycle}
                >
                  <i className="fas fa-caret-right"></i>
                </a>
              </Fragment>
            )}
            <a
              className="combat-control"
              title={localize("COMBAT.Delete")}
              data-control="endCombat"
              // @ts-expect-error foundry uses non-standard "disabled"
              disabled={!data.combatCount}
              onClick={_onCombatControl}
            >
              <i className="fas fa-trash"></i>
            </a>
          </nav>
        )}

        <nav className="encounters flexrow {{#if hasCombat}}combat{{/if}}">
          {user.isGM && (
            <Fragment>
              <a
                className="combat-control"
                title={localize("COMBAT.RollAll")}
                data-control="rollAll"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={!data.turns}
                onClick={_onCombatControl}
              >
                <i className="fas fa-users"></i>
              </a>
              <a
                className="combat-control"
                title={localize("COMBAT.RollNPC")}
                data-control="rollNPC"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={!data.turns}
                onClick={_onCombatControl}
              >
                <i className="fas fa-users-cog"></i>
              </a>
            </Fragment>
          )}

          {data.combatCount
            ? (
            <Fragment>
              {data?.combat?.data.round
                ? (
                <h3 className="encounter-title">
                  {localize("COMBAT.Round")} {data.combat.data.round}
                </h3>
                  )
                : (
                <h3 className="encounter-title">
                  {localize("COMBAT.NotStarted")}
                </h3>
                  )}
            </Fragment>
              )
            : (
            <h3 className="encounter-title">{localize("COMBAT.None")}</h3>
              )}

          {user.isGM && (
            <Fragment>
              <a
                className="combat-control"
                title={localize("COMBAT.InitiativeReset")}
                data-control="resetAll"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={!data.hasCombat}
                onClick={_onCombatControl}
              >
                <i className="fas fa-undo"></i>
              </a>
              <a
                className="combat-control"
                // @ts-expect-error it's scope not scoped
                title={data.labels.scope}
                data-control="toggleSceneLink"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={!data.hasCombat}
                onClick={_onCombatControl}
              >
                <i
                  className={cx({
                    fas: true,
                    "fa-link": !data.linked,
                    "fa-unlink": data.linked,
                  })}
                />
              </a>
              <a
                className="combat-settings"
                title={localize("COMBAT.Settings")}
                data-control="trackerSettings"
                onClick={showConfig}
              >
                <i className="fas fa-cog"></i>
              </a>
            </Fragment>
          )}
        </nav>
      </header>

      <ol id="combat-tracker" className="directory-list">
        {data.turns.map<ReactNode>((turn, i) => (
          <li
            key={i}
            className={`combatant actor directory-item flexrow ${turn.css}`}
            data-combatant-id={turn.id}
          >
            <img
              className="token-image"
              data-src={turn.img}
              title={turn.name}
            />
            <div className="token-name flexcol">
              <h4>{turn.name}</h4>
              <div className="combatant-controls flexrow">
                {user.isGM && (
                  <Fragment>
                    <a
                      className={cx({
                        "combatant-control": true,
                        active: turn.hidden,
                      })}
                      title={localize("COMBAT.ToggleVis")}
                      data-control="toggleHidden"
                      onClick={_onCombatantControl}
                    >
                      <i className="fas fa-eye-slash"></i>
                    </a>
                    <a
                      className={cx({
                        "combatant-control": true,
                        active: turn.defeated,
                      })}
                      title={localize("COMBAT.ToggleDead")}
                      data-control="toggleDefeated"
                      onClick={_onCombatantControl}
                    >
                      <i className="fas fa-skull"></i>
                    </a>
                  </Fragment>
                )}
                <div className="token-effects">
                  {Array.from(turn.effects).map<ReactNode>((effect, i) => (
                    <img key={i} className="token-effect" src={effect} />
                  ))}
                </div>
              </div>
            </div>

            {turn.hasResource && (
              <div className="token-resource">
                {/* @ts-expect-error resource not ressource */}
                <span className="resource">{turn.resource}</span>
              </div>
            )}

            <div className="token-initiative">
              {turn.hasRolled
                ? (
                <span className="initiative">{turn.initiative}</span>
                  )
                : (
                <a
                  className="combatant-control roll"
                  title={localize("COMBAT.InitiativeRoll")}
                  data-control="rollInitiative"
                  onClick={_onCombatantControl}
                />
                  )}
            </div>
          </li>
        ))}
      </ol>

      <nav id="combat-controls" className="directory-footer flexrow">
        {data.hasCombat &&
          (user.isGM
            ? (
            <Fragment>
              {data.round
                ? (
                <Fragment>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.RoundPrev")}
                    data-control="previousRound"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-step-backward"></i>
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnPrev")}
                    data-control="previousTurn"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </a>
                  <a
                    className="combat-control center"
                    title={localize("COMBAT.End")}
                    data-control="endCombat"
                    onClick={_onCombatControl}
                  >
                    {localize("COMBAT.End")}
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnNext")}
                    data-control="nextTurn"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.RoundNext")}
                    data-control="nextRound"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-step-forward"></i>
                  </a>
                </Fragment>
                  )
                : (
                <a
                  className="combat-control center"
                  title={localize("COMBAT.Begin")}
                  data-control="startCombat"
                  onClick={_onCombatControl}
                >
                  {localize("COMBAT.Begin")}
                </a>
                  )}
            </Fragment>
              )
            : (
                data.control && (
              <Fragment>
                <a
                  className="combat-control"
                  title={localize("COMBAT.TurnPrev")}
                  data-control="previousTurn"
                  onClick={_onCombatControl}
                >
                  <i className="fas fa-arrow-left"></i>
                </a>
                <a
                  className="combat-control center"
                  title={localize("COMBAT.TurnEnd")}
                  data-control="nextTurn"
                  onClick={_onCombatControl}
                >
                  {localize("COMBAT.TurnEnd")}
                </a>
                <a
                  className="combat-control"
                  title={localize("COMBAT.TurnNext")}
                  data-control="nextTurn"
                  onClick={_onCombatControl}
                >
                  <i className="fas fa-arrow-right"></i>
                </a>
              </Fragment>
                )
              ))}
      </nav>
    </Fragment>
  );
};
