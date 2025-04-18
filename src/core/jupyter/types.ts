/*
 * types.ts
 *
 * Copyright (C) 2020-2022 Posit Software, PBC
 */

import {
  kCapLoc,
  kCellAutoscroll,
  kCellClasses,
  kCellCollapsed,
  kCellColumn,
  kCellDeletable,
  kCellFigAlign,
  kCellFigAlt,
  kCellFigCap,
  kCellFigColumn,
  kCellFigEnv,
  kCellFigLink,
  kCellFigPos,
  kCellFigScap,
  kCellFigSubCap,
  kCellFormat,
  kCellLabel,
  kCellLanguage,
  kCellLinesToNext,
  kCellLstCap,
  kCellLstLabel,
  kCellMdIndent,
  kCellName,
  kCellPanel,
  kCellRawMimeType,
  kCellSlideshow,
  kCellSlideshowSlideType,
  kCellTags,
  kCellTblColumn,
  kCellUserExpressions,
  kCodeFold,
  kCodeLineNumbers,
  kCodeOverflow,
  kCodeSummary,
  kEcho,
  kError,
  kEval,
  kFigCapLoc,
  kInclude,
  kOutput,
  kTblCapLoc,
  kWarning,
} from "../../config/constants.ts";
import { FormatExecute, FormatPandoc, Metadata } from "../../config/types.ts";
import { ExecuteOptions } from "../../execute/types.ts";

// deno-lint-ignore-file camelcase

export interface JupyterCapabilities {
  versionMajor: number;
  versionMinor: number;
  versionPatch: number;
  versionStr: string;
  execPrefix: string;
  executable: string;
  conda: boolean;
  pyLauncher: boolean;
  jupyter_core: string | null;
  nbformat: string | null;
  nbclient: string | null;
  ipykernel: string | null;
  shiny: string | null;
}

export interface JupyterCapabilitiesEx extends JupyterCapabilities {
  kernels?: JupyterKernelspec[];
  venv?: boolean;
}

// cf https://github.com/jupyter/nbformat/blob/main/nbformat/v4/nbformat.v4.schema.json
// note that this doesn't directly define the kernelspec as used in kernel.json
// but defines the kernelspec object used in .ipynb files
//
// note in addition that Quarto needs to know the language name which
// might not come from the kernelspec itself but will exist in a language_info
// field. When the kernelspec object in a jupyter notebook is missing the language field,
// this object's language field will come from the language_info.name field
//
// see https://github.com/quarto-dev/quarto-cli/issues/12374
export interface JupyterKernelspec {
  name: string;
  language: string;
  display_name: string;
  path?: string;
}

export interface JupyterAssets {
  base_dir: string;
  files_dir: string;
  figures_dir: string;
  supporting_dir: string;
}

// cf https://github.com/jupyter/nbformat/blob/main/nbformat/v4/nbformat.v4.schema.json
export type JupyterLanguageInfo = {
  name: string;
  codemirror_mode?: string | Record<string, unknown>;
  file_extension?: string;
  mimetype?: string;
  pygments_lexer?: string;
};

export interface JupyterNotebook {
  metadata: {
    kernelspec: JupyterKernelspec;
    widgets?: Record<string, unknown>;
    language_info?: JupyterLanguageInfo;
    [key: string]: unknown;
  };
  cells: JupyterCell[];
  nbformat: number;
  nbformat_minor: number;
}

export interface JupyterCell {
  id?: string;
  cell_type: "markdown" | "code" | "raw";
  execution_count?: null | number;
  metadata: JupyterCellMetadata;
  source: string | string[];
  attachments?: Record<string, Record<string, string>>;
  outputs?: JupyterOutput[];
}

export interface JupyterCellMetadata {
  // nbformat v4 spec
  [kCellCollapsed]?: boolean;
  [kCellAutoscroll]?: boolean | "auto";
  [kCellDeletable]?: boolean;
  [kCellFormat]?: string; // for "raw"
  [kCellName]?: string; // optional alias for 'label'
  [kCellTags]?: string[];
  [kCellRawMimeType]?: string;

  // used to preserve line spacing
  [kCellLinesToNext]?: number;

  // slideshow
  [kCellSlideshow]?: JupyterCellSlideshow;

  // nbdev language
  [kCellLanguage]?: string;

  // user_expressions
  [kCellUserExpressions]?: JupyterUserExpression[];

  // anything else
  [key: string]: unknown;
}

export interface JupyterCellSlideshow {
  [kCellSlideshowSlideType]: string;
}

export interface JupyterCellWithOptions extends JupyterCell {
  id: string;
  options: JupyterCellOptions;
  optionsSource: string[];
}

export interface JupyterUserExpression {
  expression: string;
  result: JupyterUserExpressionResult;
}

export interface JupyterCellOutputData {
  data: { [mimeType: string]: unknown };
}

export interface JupyterUserExpressionResult extends JupyterCellOutputData {
  metadata: Metadata;
  status: string;
}

export interface JupyterOutput {
  output_type: "stream" | "display_data" | "execute_result" | "error";
  execution_count?: null | number;
  isolated?: boolean;
  metadata?: Record<string, unknown>;
  data?: Record<string, unknown>;
  name?: string;
  text?: string[] | string;
}

export interface JupyterOutputStream extends JupyterOutput {
  name: "stdout" | "stderr";
  text: string[] | string;
}

export interface JupyterOutputDisplayData extends JupyterOutput {
  data: { [mimeType: string]: unknown };
  metadata: { [mimeType: string]: Record<string, unknown> };
  noCaption?: boolean;
}

export interface JupyterCellOptions extends JupyterOutputFigureOptions {
  [kCellLabel]?: string;
  [kCellFigCap]?: string | string[];
  [kCellFigSubCap]?: string[] | true;
  [kFigCapLoc]?: string;
  [kTblCapLoc]?: string;
  [kCapLoc]?: string;
  [kCellFigColumn]?: string;
  [kCellTblColumn]?: string;
  [kCellLstLabel]?: string;
  [kCellLstCap]?: string;
  [kCellClasses]?: string;
  [kCellPanel]?: string;
  [kCellColumn]?: string;
  [kCodeFold]?: string;
  [kCodeLineNumbers]?: boolean | string;
  [kCodeSummary]?: string;
  [kCodeOverflow]?: string;
  [kCellMdIndent]?: string;
  [kEval]?: true | false | null;
  [kEcho]?: boolean | "fenced";
  [kWarning]?: boolean;
  [kError]?: boolean;
  [kOutput]?: boolean | "all" | "asis";
  [kInclude]?: boolean;
  [key: string]: unknown;
}

export interface JupyterOutputFigureOptions {
  [kCellFigScap]?: string;
  [kCellFigLink]?: string;
  [kCellFigAlign]?: string;
  [kCellFigEnv]?: string;
  [kCellFigPos]?: string;
  [kCellFigAlt]?: string;
}

export interface JupyterToMarkdownOptions {
  executeOptions: ExecuteOptions;
  language: string;
  assets: JupyterAssets;
  execute: FormatExecute;
  keepHidden?: boolean;
  preserveCellMetadata?: boolean;
  preserveCodeCellYaml?: boolean;
  toHtml?: boolean;
  toLatex?: boolean;
  toMarkdown?: boolean;
  toIpynb?: boolean;
  toPresentation?: boolean;
  figFormat?: string;
  figDpi?: number;
  figPos?: string | null;
  fixups?: "minimal" | "default";
  outputPrefix?: string;
}

export interface JupyterToMarkdownResult {
  metadata?: Metadata;
  pandoc?: FormatPandoc;
  dependencies?: JupyterWidgetDependencies;
  htmlPreserve?: Record<string, string>;
  cellOutputs: JupyterCellOutput[];
  notebookOutputs?: {
    prefix?: string;
    suffix?: string;
  };
}

export interface JupyterCellOutput {
  id?: string;
  options?: JupyterCellOptions;
  metadata?: JupyterCellMetadata;
  markdown: string;
}

export interface JupyterWidgetsState {
  state: Record<string, unknown>;
  version_major: number;
  version_minor: number;
}

export interface JupyterWidgetDependencies {
  jsWidgets: boolean;
  jupyterWidgets: boolean;
  htmlLibraries: string[];
  widgetsState?: JupyterWidgetsState;
}
