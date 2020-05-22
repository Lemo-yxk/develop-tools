import React, {Component} from 'react';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, {TreeItemProps} from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import {Folder, FolderOpen, StarBorderOutlined} from '@material-ui/icons';
import {SvgIconProps} from '@material-ui/core/SvgIcon';
import {Rnd} from "react-rnd";
import "./httpClient.scss"
import {TreeNode} from "../../../interface/modal";

import {Menu, MenuItem, TextField} from "@material-ui/core";


declare module 'csstype' {
    interface Properties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon?: React.ElementType<SvgIconProps>;
    labelInfo?: JSX.Element | string;
    labelText: JSX.Element | string;
};

const useTreeItemStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
            // '&:hover > $content': {
            //     backgroundColor: theme.palette.action.hover,
            // },
            // '&:focus > $content, &$selected > $content': {
            //     backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            //     color: 'var(--tree-view-color)',
            // },
            // '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            //     backgroundColor: 'transparent',
            // },
        },
        content: {
            color: theme.palette.text.secondary,
            // borderTopRightRadius: theme.spacing(2),
            // borderBottomRightRadius: theme.spacing(2),
            // paddingRight: theme.spacing(1),
            fontWeight: theme.typography.fontWeightMedium,
            '$expanded > &': {
                fontWeight: theme.typography.fontWeightRegular,
            },
        },
        group: {
            marginLeft: 0,
            '& $content': {
                paddingLeft: theme.spacing(2),
            },
        },
        expanded: {},
        selected: {},
        label: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
        labelRoot: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0.5, 0),
        },
        labelIcon: {
            marginRight: theme.spacing(1),
        },
        labelText: {
            fontWeight: 'inherit',
            flexGrow: 1,
        },
    }),
);

function StyledTreeItem(props: StyledTreeItemProps) {
    const classes = useTreeItemStyles();
    const {labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other} = props;

    return (

        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    {LabelIcon !== undefined ? <LabelIcon color="inherit" className={classes.labelIcon}/> : null}
                    <Typography component={"div"} variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography component={"div"} variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                // group: classes.group,
                label: classes.label,
            }}
            {...other}
        />

    );
}

const useStyles =
    createStyles({
        root: {
            // height: 264,
            // flexGrow: 1,
            // maxWidth: 400,
        },
    })

class HttpClient extends Component<any, any> {


    state = {
        treeNode: [] as TreeNode[],
        expanded: [] as string[],
        selected: "",
        openContextMenu: false,
        editValue: "" as any
    }

    x = 0
    y = 0

    onToggle(e: any, ids: string[]) {
        this.setState({expanded: ids})
    }

    onSelect(e: any, id: string) {
        this.setState({selected: id})
    }

    createTreeView(treeNode: TreeNode) {
        let tree = [] as JSX.Element[]
        for (let i = 0; i < treeNode.Children.length; i++) {
            tree.push(this.createNode(treeNode.Children[i], this.createTreeView(treeNode.Children[i])))
        }
        return tree
    }

    createNode(e: TreeNode, c: JSX.Element[]) {
        return <StyledTreeItem
            onContextMenu={(ev) => this.contextMenuOpen(ev, e.ID)}
            onDoubleClick={() => e.onDoubleClick ? e.onDoubleClick(e) : () => {
            }}
            key={e.ID}
            nodeId={e.ID}
            labelText={e.LabelText}
            labelIcon={e.LabelIcon}
            labelInfo={e.LabelInfo}
            color={e.Color}
            bgColor={e.BgColor}
            children={c.length > 0 ? c : null}
            onClick={() => {
            }}
        />
    }

    color: { [key: string]: { [key: string]: string } } = {
        "GET": {color: "#1a73e8", bgColor: "#e8f0fe"},
        "POST": {color: "#e3742f", bgColor: "#fcefe3"},
        "PUT": {color: "#a250f5", bgColor: "#f3e8fd"},
        "PATCH": {color: "#3c8039", bgColor: "#e6f4ea"},
        "DELETE": {color: "#d15b56", bgColor: "#e1ee22"},
        "OPTIONS": {color: "#887bd1", bgColor: "#f3e00d"},
        "HEAD": {color: "#53acd5", bgColor: "#99eed5"},
    }

    getColor(method: string) {
        return this.color[method.toUpperCase()]
    }

    findNode(id: string, treeNode: TreeNode[]): TreeNode | null {

        for (let i = 0; i < treeNode.length; i++) {

            if (treeNode[i].ID === id) {
                return treeNode[i]
            } else {
                if (treeNode[i].Children.length > 0) {
                    let res = this.findNode(id, treeNode[i].Children)
                    if (res) return res
                }
            }
        }

        return null
    }

    onDoubleClick(node: TreeNode) {

        let value = node.LabelText

        node.LabelText = <TextField
            id="standard-basic"
            style={{width:"100%"}}
            onChange={(e) => value = e.target.value}
            placeholder={"control to picker"}
            defaultValue={node.LabelText}
            size={"small"}
            autoFocus={true}
            spellCheck={false}
            onBlur={() => {
                node.LabelText = value
                this.setState({treeNode: this.state.treeNode})
            }}
        />

        this.setState({treeNode: this.state.treeNode})
    }

    componentDidMount() {
        let treeNode: TreeNode[] = [
            {
                ID: "1", LabelText: "1", Children: [
                    {
                        ID: "8", LabelText: "8", Children: [],
                        onDoubleClick: (node: TreeNode) => this.onDoubleClick(node),
                    },
                    {ID: "9", LabelText: "9", Children: []},
                ],
            },
            {ID: "2", LabelText: "2", Children: []},
            {ID: "3", LabelText: "3", Children: []},
            {ID: "4", LabelText: "4", Children: []},
            {
                ID: "5", LabelText: "5", Children: [
                    {
                        ID: "10", LabelText: "10", Children: [
                            {ID: "12", LabelText: "12", Children: []},
                        ]
                    },
                    {ID: "11", LabelText: "11", Children: []},
                ]
            },
            {ID: "6", LabelText: "6", Children: []},
            {ID: "7", LabelText: "7", Children: []},
        ]
        this.setState({treeNode: treeNode})
    }

    contextMenuOpen = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, id: string) => {
        event.stopPropagation();
        this.x = event.clientX - 2
        this.y = event.clientY - 4
        this.setState({openContextMenu: true})
    };

    contextMenuClose = () => {
        this.setState({openContextMenu: false})
    };

    render() {
        return (

            <div className={"httpClient"}>
                <Rnd
                    default={{height: "100%", width: "20%", x: 0, y: 0}}
                    minWidth={50}
                    maxWidth={"40%"}
                    bounds=".content"
                    enableResizing={{right: true}}
                    disableDragging={true}
                    className="treeView"
                >
                    <TreeView
                        defaultCollapseIcon={<Folder/>}
                        defaultExpandIcon={<FolderOpen/>}
                        // defaultParentIcon={<LocalOfferIcon/>}
                        defaultEndIcon={<StarBorderOutlined/>}
                        className={this.props.classes.root}
                        expanded={this.state.expanded}
                        onNodeToggle={(e: any, ids: string[]) => this.onToggle(e, ids)}
                        selected={this.state.selected}
                        onNodeSelect={(e: any, id: string) => this.onSelect(e, id)}
                    >
                        {this.state.treeNode.map(e => this.createNode(e, this.createTreeView(e)))}

                    </TreeView>
                </Rnd>

                <div className={"showRequest"}>
                    show request
                </div>

                <Rnd
                    default={{height: "100%", width: "45%", x: 0, y: 0}}
                    minWidth={50}
                    maxWidth={"100%"}
                    bounds=".content"
                    enableResizing={{left: true}}
                    disableDragging={true}
                    className="showResponse"
                >
                    show response
                </Rnd>


                <Menu
                    keepMounted
                    open={this.state.openContextMenu}
                    onClose={this.contextMenuClose}
                    anchorReference="anchorPosition"
                    anchorPosition={{top: this.y, left: this.x}}
                    className={"contentMenu"}
                >
                    <MenuItem onClick={this.contextMenuClose}>Duplicate</MenuItem>
                    <MenuItem onClick={this.contextMenuClose}>Copy</MenuItem>
                    <MenuItem onClick={this.contextMenuClose}>Delete</MenuItem>
                    <MenuItem onClick={this.contextMenuClose}>Edit</MenuItem>
                </Menu>
            </div>
        )
    }

}


export default withStyles(useStyles)(HttpClient)

