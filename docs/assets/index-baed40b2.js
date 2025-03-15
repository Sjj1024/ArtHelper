import{d as e,r as s,j as r,B as a,t as o,m as i}from"./index-efa3a32c.js";import{F as n}from"./index-ae2d5997.js";import{I as l}from"./index-8c8b720f.js";/* empty css              */import{T as t}from"./index-47693ae2.js";import{u as m}from"./user-66ba9e41.js";import{u as d}from"./useSetState-78ffd672.js";import{M as p}from"./index-46e73bcd.js";import"./context-cb88fb1e.js";import"./responsiveObserve-b13564d4.js";import"./index-177532f7.js";import"./statusUtils-b010cbea.js";import"./EyeOutlined-319494bf.js";import"./SearchOutlined-03c63d28.js";import"./ActionButton-e012fb99.js";import"./Portal-08554165.js";import"./getScrollBarSize-c6833c2b.js";import"./pickAttrs-1cd23dfa.js";function c(){document.title="个人中心";const c=e((e=>e.app.powersCode)),[u,f]=d({operateType:"add",nowData:null,modalShow:!1,modalLoading:!1}),[x,j]=s.useState([]),{userinfo:h}=e((e=>e.app)),[I]=n.useForm();s.useEffect((()=>{I.setFieldsValue({username:h.userBasicInfo.username,password:"*********",email:h.userBasicInfo.emailaddr,phone:h.userBasicInfo.mob,role:h.userBasicInfo.rolelist.rolename,status:0===h.userBasicInfo.status?"冻结":"激活"}),(async()=>{const e=(await m.getAgents()).data.map((e=>({label:e.providername,value:e.uuid})));j(e)})()}),[]);return r.jsxs(r.Fragment,{children:[r.jsxs(n,{name:"wrap",labelCol:{flex:"80px"},labelAlign:"left",wrapperCol:{flex:1},colon:!1,style:{maxWidth:600},children:[r.jsx(n.Item,{label:"用户名：",name:"username",children:r.jsx("span",{children:h.userBasicInfo.username})}),r.jsx(n.Item,{label:"邮箱：",name:"email",children:r.jsx("span",{children:h.userBasicInfo.emailaddr?h.userBasicInfo.emailaddr:"-"})}),r.jsx(n.Item,{label:"手机号码：",name:"phone",children:r.jsx("span",{children:h.userBasicInfo.mob})}),r.jsx(n.Item,{label:"代理：",name:"password",children:r.jsx("span",{children:h.userBasicInfo.providerinfor?h.userBasicInfo.providerinfor.agentinfor?h.userBasicInfo.providerinfor.agentinfor.providername:"":"-"})}),r.jsx(n.Item,{label:"门店：",name:"proxy",children:r.jsx("span",{children:h.userBasicInfo.providerinfor?h.userBasicInfo.providerinfor.providername:"-"})}),r.jsx(n.Item,{label:"角色：",name:"role",children:r.jsx(t,{children:h.userBasicInfo.rolelist.rolename})}),c.includes("my:up")&&r.jsx(n.Item,{label:" ",children:r.jsx(a,{type:"primary",htmlType:"submit",onClick:e=>{f({modalShow:!0})},children:"修改"})})]}),r.jsx(p,{title:"修改资料",open:u.modalShow,cancelText:"取消",okText:"确定",onOk:async()=>{try{const e=await I.validateFields();if("*********"!==e.password&&""!==e.password){await m.editPassword({passwd:e.password})}await m.editInfo({mob:e.phone,email:e.email});i.success("用户修改成功"),f({modalShow:!1})}finally{f({modalLoading:!1})}},onCancel:()=>{f({modalShow:!1})},confirmLoading:u.modalLoading,children:r.jsxs(n,{form:I,labelCol:{flex:"70px"},initialValues:{conditions:1},children:[r.jsx(n.Item,{label:"用户名",name:"username",rules:[{max:20,message:"最多输入20位字符"}],children:r.jsx("span",{children:h.userBasicInfo.username})}),r.jsx(n.Item,{label:"密码",name:"password",rules:[{min:6,message:"最少输入6位字符"},{max:12,message:"最多输入12位字符"}],children:r.jsx(l,{placeholder:"请输入密码",autoComplete:"off",disabled:"see"===u.operateType})}),r.jsx(n.Item,{label:"电话",name:"phone",rules:[()=>({validator:(e,s)=>{const r=s;return r&&!o.checkPhone(r)?Promise.reject("请输入有效的手机号码"):Promise.resolve()}}),{required:!0,whitespace:!0,message:"请输入手机号"}],children:r.jsx(l,{placeholder:"请输入手机号",maxLength:11,autoComplete:"off",disabled:"see"===u.operateType})}),r.jsx(n.Item,{label:"邮箱",name:"email",rules:[()=>({validator:(e,s)=>{const r=s;return r&&!o.checkEmail(r)?Promise.reject("请输入有效的邮箱地址"):Promise.resolve()}})],children:r.jsx(l,{placeholder:"请输入邮箱地址",autoComplete:"off",disabled:"see"===u.operateType})}),r.jsx(n.Item,{label:"所属代理",name:"proxy",children:r.jsx("span",{children:h.userBasicInfo.providerinfor?h.userBasicInfo.providerinfor.agentinfor?h.userBasicInfo.providerinfor.agentinfor.providername:"":"-"})}),r.jsx(n.Item,{label:"所属门店",name:"store",children:r.jsx("span",{children:h.userBasicInfo.providerinfor?h.userBasicInfo.providerinfor.providername:"-"})})]})})]})}export{c as default};
