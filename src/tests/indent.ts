import { deepStrictEqual } from "assert";
import { getFormatted, getTokens } from "../main.js";
import { Test } from "./common.js";

export const indent: Test[] = [
  {
    description:
      "expect enforce correct indent with several end keywords on single line",
    f: () => {
      const textExpected = `
begin
  if true then begin
    A := true;
    if true then begin
  B := true;end;end;
end.`;
      const text = `
begin
  if true then begin
A := true;
  if true then begin
B := true;end;end;
  end.`;
      const formatted = getFormatted(getTokens(text), {
        indent: { size: 2 },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to enforce correct indent",
    f: () => {
      const textExpected = `
program name;
uses
  unit1,
  unit2;

const
  const1 = 1;
  const2 = 2;

var
  var1: integer;
  var2: string;
begin
  if true then begin
    A := true;
    if true then begin
      B := true;
      if true then
        C := true;
    end;
  end;
end.`;
      const text = `
program name;
uses
unit1,
    unit2;

const
const1 = 1;
  const2 = 2;

var
  var1: integer;
 var2: string;
begin
  if true then begin
A := true;
  if true then begin
B := true;
  if true then
C := true;
end;
 end;
end.`;
      const formatted = getFormatted(getTokens(text), {
        indent: { size: 2 },
        blankCharacters: { trailing: "remove" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to enforce correct indent with single statement",
    f: () => {
      const textExpected = `
begin
  while true do
    if true then
      A := true
    else
      A := false;
end.`;
      const text = `
begin
while true do
if true then
A := true
else
A := false;
end.`;
      const formatted = getFormatted(getTokens(text), {
        indent: { size: 2 },
        blankCharacters: { trailing: "remove" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to enforce correct indent with nested",
    f: () => {
      const textExpected = `
begin
  if true then
    if true then
      A := true;
end.`;
      const text = `
begin
if true then
if true then
A := true;
end.`;
      const formatted = getFormatted(getTokens(text), {
        indent: { size: 2 },
        blankCharacters: { trailing: "remove" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to enforce single space after if",
    f: () => {
      const textExpected = `
begin
  if true then begin
     A := true;
   end;
  if true then
   begin
     A := true;
   end;
  if true then
   if true then
    A := true
   else
    A := false;
end.`;
      const text = `
begin
if true then begin
A := true;
end;
if true then
begin
A := true;
end;
if true then
if true then
A := true
else
A := false;
end.`;
      const formatted = getFormatted(getTokens(text), {
        indent: { size: 2, spaceAfterIf: "add" },
        blankCharacters: { trailing: "remove" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
];
