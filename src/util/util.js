
const chooseRegRxp = function (req, res, key, reg) {


    if (req.body[key] == undefined) {
        res.send({
            errmsg: `${key}参数错误`,
            errno: -1
        })
        return {
            reg: false
        }
    } else {
        console.log("" + req.body[key])
        let value = ("" + req.body[key]).toString();
        console.log(value)
        // 忽略空白字符
        value = value.replace(/\s/igm, "")
        // 验证姓名表达式
        // let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
        let result = reg.test(value)
        if (result == false) {
            res.send({
                errmsg: `${key}内容错误`,
                errno: -2
            })
            return false
        } else if (result == true) {
            return {
                reg: true,
                key: value
            }
        } else {
            res.send({
                errmsg: "非法操作",
                errno: -10000
            })
            return {
                reg: false
            }
        }

    }
}
module.exports = {
    chooseRegRxp
} 