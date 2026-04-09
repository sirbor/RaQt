import { styled, TextField as MuiTextField, TextFieldProps } from '@mui/material';
import React from 'react';

const ink = '#1a1a1a';
const muted = '#6b6b6b';
const gold = '#a68b5b';

const StyledTextField = styled(MuiTextField)`
  &.MuiInputBase-root {
    color: ${ink};
    &.MuiInput-root {
      color: ${ink};
      height: 30px;
      font-weight: 400;
      font-size: 13px;
      line-height: 1.4;
      font-family: IBM Plex Sans, system-ui, sans-serif;
      margin-bottom: 24px;
    }
  }

  input {
    color: ${ink};
    height: 30px;
    padding-bottom: 2px;
  }

  label {
    color: ${muted};
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    &.Mui-focused {
      color: ${gold};
    }
  }
`;

const TextField: React.FC<Omit<TextFieldProps, 'variant'>> = (props) => {
  const { InputProps: inputPropsProp, ...rest } = props;
  return (
    <div style={{ borderBottom: `1px solid rgba(26, 26, 26, 0.12)` }}>
      <StyledTextField
        {...rest}
        variant="standard"
        fullWidth
        color="primary"
        InputProps={{
          required: true,
          disableUnderline: true,
          ...inputPropsProp,
        }}
      />
    </div>
  );
};

export default TextField;
