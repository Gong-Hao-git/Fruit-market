import { ElMessage } from "element-plus";
import { uploadFile } from "@/api/backstage";


//获取图片路径展示
export const getImgUrl = (fileName: string, file: any) => {
    let url = URL.createObjectURL(file);
    return url;
}

//上传文件
export const beginUpload = (file: any, func?: any, errorFunc?: any, path?: string) => {
    let obj = {
        fileName: file.name,
        file: file.raw,
        path: 'header',
        typBool: true,
        func: () => {
        },
        errorFunc: () => {
        }
    }
    if (func) {
        obj.func = func;
    }
    if (errorFunc) {
        obj.errorFunc = errorFunc;
    }
    if (path) {
        obj.path = path;
    }
    fileUploadModel(obj);
}

//上传文件组件
export const fileUploadModel = (data: any) => {
    let { fileName, file, path, typBool, func, errorFunc } = data;
    let formData = new FormData();
    //此处的path只是后端需要的一个字段，并非路径
    Object.entries({ file: file, path: path }).forEach(([key, value]) => {
        formData.append(key, value);
    });
    uploadFile(formData).then((res: any) => {
        if (res.code == "20000") {
            func(res);
        } else {
            errorFunc();
        }
    }).catch(() => {
        errorFunc();
    })
}


//多个上传文件
export const beginUploadMore = (files: any, func?: any, errorFunc?: any) => {
    let array: any = [];
    files.forEach((file: any) => {
        let formData = new FormData();
        //此处的path只是后端需要的一个字段，并非路径
        Object.entries({ file: file.raw }).forEach(([key, value]) => {
            formData.append(key, value);
        });
        array.push(uploadFile(formData))
    })
    Promise.all(array).then((res: any) => {
        let bool: any = true;
        res.forEach((item: any) => {
            if (item.code != "20000") {
                bool = false;
            }
        })
        if (bool == false) {
            ElMessage.warning("文件上传失败");
            errorFunc();
        } else {
            func(res);
        }
    }).catch(() => {
        errorFunc();
    })
}

export const leaveType = [
    {
        label: "用户评价",
        value: "1",
    },
    {
        label: "意见建议",
        value: "2",
    },
    {
        label: "系统优化",
        value: "3",
    },
    {
        label: "其他留言",
        value: "4",
    },
]
