import Time from "../time/Time";
import Encrypt from "../encrypt/Encrypt";
import {Group} from "../../../interface/modal";
import ColorPicker from "../colorPicker/ColorPicker";
import JsonToStruct from "../jsonToStruct/JsonToStruct";


const DevelopmentList: Group[] = [

    // {
    //     Name: '首页', Children: [
    //         {Path: '/index/home', Name: '首页', Component: Home}
    //     ]
    // },

    {
        Name: '时间', Children: [
            {Path: '/index/time', Name: '时间转换', Component: Time},
        ]
    },
    {
        Name: '密码', Children: [
            {Path: '/index/encrypt', Name: '加密解密', Component: Encrypt},
        ]
    },
    {
        Name: '颜色', Children: [
            {Path: '/index/colorPicker', Name: '提取颜色', Component: ColorPicker},
        ]
    },
    {
        Name: 'JSON', Children: [
            {Path: '/index/jsonToStruct', Name: 'JSON转换', Component: JsonToStruct},
        ]
    }

]


export default DevelopmentList
