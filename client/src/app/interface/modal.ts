import React from "react";
import {SvgIconProps} from "@material-ui/core/SvgIcon";

export interface ModalConfig {
    Content?: any
    Title?: any
    Action?: any
    Ok: any
}

export interface Develop {
    Name: string
    Path: string
    Component: any
    DisableSelected?: boolean
}

export interface Group {
    Name: string
    Children: Develop[]
}

export interface TreeNode {
    ID: string
    LabelText: JSX.Element | string
    Children: TreeNode[]
    LabelIcon?: React.ElementType<SvgIconProps>
    LabelInfo?: JSX.Element | string
    Color?: string
    BgColor?: string
    onDoubleClick?:any
}
