import { css } from "lit";

export const styles = css`
  .iu-controller.iu-hidden {
    display: none;
  }

  .iu-control-panel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .iu-control-panel-item {
    padding: 0.5em 0 0.5em 1em;
  }

  .iu-zones.iu-hidden.iu-content {
    display: none;
  }

  .iu-sequences.iu-hidden.iu-content {
    display: none;
  }

  .iu-hidden .iu-content {
    display: none;
  }

  .iu-hidden .iu-expander::before {
    content: "\u25B6";
    font-size: large;
  }

  .iu-expander::before {
    content: "\u25BC";
    font-size: large;
  }

  .iu-controller-row.iu-td {
    display: flex;
    align-items: center;
    min-height: 3em;
  }

  .iu-zone-row.iu-td {
    display: flex;
    align-items: center;
    min-height: 3em;
  }

  .iu-sequence-row.iu-td {
    display: flex;
    align-items: center;
    min-height: 3em;
  }

  .iu-sequence-zone-row.iu-td {
    display: flex;
    align-items: center;
    height: 2em;
  }

  .iu-timeline-scheduled,
  .iu-timeline-scheduled .iu-schedule {
    color: var(--label-badge-blue, #039be5);
  }

  .iu-timeline-next,
  .iu-timeline-next .iu-schedule {
    color: var(--label-badge-red, #db4437);
  }

  .iu-timeline-history,
  .iu-timeline-history .iu-schedule {
    color: var(--label-badge-green, #43a047);
  }

  .iu-td {
    display: flex;
    align-items: center;
  }

  .iu-td1 {
    flex: 1.5em;
    text-align: center;
    cursor: pointer;
  }

  .iu-td2 {
    flex: 30px;
    text-align: center;
  }

  .iu-td3 {
    flex: 40%;
    text-align: left;
  }

  .iu-td4 {
    flex: 20%;
    text-align: center;
  }

  .iu-td5 {
    flex: 15%;
    text-align: center;
  }

  .iu-td6 {
    flex: 15%;
    text-align: center;
  }

  .iu-td7 {
    flex: 10%;
    text-align: center;
  }

  .iu-on .iu-duration,
  .iu-delay .iu-duration {
    color: var(--state-on-color, #66a61e);
  }

  .iu-paused .iu-duration {
    color: var(--state-on-color, #66a61e);
    animation: 1s step-end infinite duration-paused;
  }

  @keyframes duration-paused {
    50% {
      opacity: 0;
    }
  }

  .iu-schedule {
    color: var(--secondary-text-color, #727272);
    font-size: small;
  }

  .iu-manual .iu-schedule {
    color: var(--label-badge-red, #df4c1e);
  }

  .iu-suspended .iu-start {
    color: var(--label-badge-yellow, #ffff00);
    font-style: italic;
  }

  .iu-name {
    color: var(--secondary-text-color, #727272);
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ha-icon {
    color: var(--state-icon-color, #44739e);
  }

  .iu-on .iu-td2 ha-icon,
  .iu-paused .iu-td2 ha-icon,
  .iu-delay .iu-td2 ha-icon {
    color: var(--state-icon-active-color, #fdd835);
  }

  .iu-menu {
    position: relative;
    display: inline-block;
  }

  .iu-menu-button {
    background-color: transparent;
    text-align: center;
    display: block;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }

  .iu-menu-content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 200px;
    padding: 10px 0;
    position: absolute;
    background-color: var(--card-background-color, white);
    right: 0;
    box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
    border-radius: 5px;
    z-index: 1;
  }

  .iu-menu-content.iu-hidden {
    display: none;
  }

  .iu-menu-content .iu-menu-item {
    display: flex;
    padding: 0px 5px;
    line-height: 48px;
  }

  .iu-menu .iu-menu-item:hover {
    color: var(--primary-color, #b3e5fc);
    background-color: var(--secondary-background-color, #e5e5e5);
  }

  .iu-menu-item.iu-hidden {
    display: none;
  }

  .iu-mc1 {
    flex: 30%;
    text-align: left;
  }

  .iu-mc2 {
    flex: 40%;
    text-align: right;
  }

  .iu-mc3 {
    flex: 30%;
    text-align: center;
  }

  .iu-mc3 ha-icon {
    display: flex;
  }

  .iu-adjust-input:invalid,
  .iu-time-input:invalid {
    color: var(--label-badge-red, #df4c1e);
  }
`;
