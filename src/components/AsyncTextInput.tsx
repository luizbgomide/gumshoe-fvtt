/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React from "react";
import { useAsyncUpdate } from "../hooks/useAsyncUpdate";

type AsyncTextInputProps = {
  value: undefined|string,
  onChange: (newValue: string) => void,
  className?: string,
};

export const AsyncTextInput: React.FC<AsyncTextInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const {
    onChangeCb,
    onFocus,
    onBlur,
    display,
  } = useAsyncUpdate(value, onChange);

  return (
    <input
      css={css`
        flex: 1;
        margin-left: 0.5em;
        width: 100%;
      `}
      className={className}
      data-lpignore="true"
      value={display}
      onChange={onChangeCb}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
