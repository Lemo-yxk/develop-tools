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
}

export interface Group {
    Name: string
    Children: Develop[]
}
