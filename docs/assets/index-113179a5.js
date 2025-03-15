import{d as e,r as a,j as t,B as i,h as l,m as d}from"./index-efa3a32c.js";import{F as n}from"./index-ae2d5997.js";import{I as o}from"./index-8c8b720f.js";import{a as s}from"./index-639ffc53.js";import"./index-0373e759.js";/* empty css              */import"./index-9b480cfe.js";import"./index-9b8a3313.js";import{P as m}from"./index-94ed3db3.js";import{D as r}from"./index-1acfbbfd.js";import"./index-47693ae2.js";import{I as u}from"./index-06b8a89d.js";import{D as c}from"./index-65748fb5.js";import{a as p}from"./v1api-f78cc73a.js";import{u as g}from"./useSetState-78ffd672.js";import{M as x}from"./index-46e73bcd.js";import{S as h}from"./index-1c1deade.js";import{P as j}from"./PlusCircleOutlined-176a31dc.js";import"./context-cb88fb1e.js";import"./responsiveObserve-b13564d4.js";import"./index-177532f7.js";import"./statusUtils-b010cbea.js";import"./EyeOutlined-319494bf.js";import"./SearchOutlined-03c63d28.js";import"./pickAttrs-1cd23dfa.js";import"./index-40784afc.js";import"./getScrollBarSize-c6833c2b.js";import"./isEqual-8ee5b3ce.js";import"./useForceUpdate-9ad39bdf.js";import"./index-0a1440ec.js";import"./ActionButton-e012fb99.js";import"./CalendarOutlined-8ff6678f.js";import"./Portal-08554165.js";import"./CheckOutlined-f0d55485.js";function v(){document.title="联赛管理";const v=e((e=>e.app.powersCode)),[y]=n.useForm(),[f,w]=a.useState([]),[S,Y]=a.useState(!1),[k,D]=g({pageNum:1,pageSize:10,total:0}),[I,b]=g({operateType:"add",nowData:null,modalShow:!1,modalLoading:!1}),[M,C]=a.useState(0),F={leaguename:"",leaguemode:void 0,validcount:0,launchtime:"",endtime:""},z=(e,a)=>{b({operateType:a,nowData:e,modalShow:!0,modalLoading:!1}),e?(y.setFieldsValue({leaguename:e.leaguename,leaguemode:e.leaguemode,validcount:e.validcount,launchtime:e.launchtime?l(e.launchtime):"",endtime:e.endtime?l(e.endtime):""}),C(e.leaguemode),1===e.leaguemode?E(!1):E(!0)):y.setFieldsValue({...F})},L=()=>{y.resetFields(),b({modalShow:!1})},T=async e=>{const a={page:e.pageNum,limit:e.pageSize};Y(!0);try{const t=await p.leagueList(a);t&&200===t.code?(w(t.data),D({total:t.count,pageNum:e.pageNum,pageSize:e.pageSize})):d.error((null==t?void 0:t.message)??"获取失败")}finally{Y(!1)}},O=[{label:"赛季积分",value:0},{label:"滚动积分",value:1}],P=[{title:"ID",dataIndex:"id",key:"id"},{title:"联赛名称",dataIndex:"leaguename",key:"leaguename"},{title:"积分方式",dataIndex:"leaguemode",key:"leaguemode",render:e=>{var a;return null==(a=O.find((a=>a.value===e)))?void 0:a.label}},{title:"开始日期",dataIndex:"launchtime",key:"launchtime"},{title:"结束日期",dataIndex:"endtime",key:"endtime"},{title:"统计数量",dataIndex:"validcount",key:"validcount"},{title:"状态",dataIndex:"statusname",key:"statusname",render:(e,a)=>t.jsx("span",{style:{color:2===a.status?"red":""},children:e})},{title:"创建时间",dataIndex:"addtime",key:"addtime"},{title:"操作",key:"control",render:(e,a)=>{const i=[];v.includes("league:edit")&&i.push(t.jsx("span",{style:{color:" rgb( 66,149,229)",cursor:"pointer"},onClick:()=>z(a,"edit"),children:"编辑"},"1")),v.includes("league:del")&&i.push(t.jsx(m,{title:"确定删除吗？",onConfirm:()=>{(async e=>{const a={uuid:e.uuid},t=await p.delLeague(a);t&&200===t.code?(d.success("操作成功"),T(k)):d.error((null==t?void 0:t.message)??"操作失败")})(a)},okText:"确定",cancelText:"取消",children:t.jsx("span",{style:{color:" rgb( 66,149,229)",cursor:"pointer"},children:"删除"})},"2"));const l=[];return i.forEach(((e,a)=>{a&&l.push(t.jsx(c,{type:"vertical"},`line${a}`)),l.push(e)})),l}}],[q,E]=a.useState(!1),N=a.useMemo((()=>f.map(((e,a)=>({key:e.id,id:e.id,uuid:e.uuid,leaguename:e.leaguename,leaguemode:e.leaguemode,launchtime:e.launchtime,endtime:e.endtime,validcount:e.validcount,status:e.status,statusname:e.statusname,addtime:e.addtime})))),[k,f]);return a.useEffect((()=>{T(k)}),[]),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx("ul",{style:{textAlign:"right",marginBottom:"10px"},children:v.includes("league:add")&&t.jsx("li",{children:t.jsx(i,{type:"primary",icon:t.jsx(j,{}),disabled:!v.includes("league:add"),onClick:()=>z(null,"add"),children:"新建联赛"})})})}),t.jsx("div",{children:t.jsx(s,{columns:P,loading:S,dataSource:N,rowKey:e=>e.id,pagination:{total:k.total,current:k.pageNum,pageSize:k.pageSize,showQuickJumper:!1,showTotal:e=>`共 ${e} 条数据`,onChange:(e,a)=>((e,a)=>{T({pageNum:e,pageSize:a||k.pageSize})})(e,a)}})}),t.jsx(x,{title:{add:"新建联赛",edit:"编辑联赛"}[I.operateType],open:I.modalShow,cancelText:"取消",okText:"确认",onOk:async e=>{b({modalLoading:!0});try{const e=await y.validateFields();if("add"===I.operateType){let a={};a=q?{leaguename:e.leaguename,leaguemode:e.leaguemode,validcount:e.validcount,launchtime:e.launchtime?e.launchtime.format("YYYY-MM-DD"):"",endtime:e.endtime?e.endtime.format("YYYY-MM-DD"):""}:{leaguename:e.leaguename,leaguemode:e.leaguemode,validcount:e.validcount};const t=await p.addLeague(a);t&&200===t.code?(d.success("添加成功"),T(k),L()):d.error((null==t?void 0:t.message)??"添加失败")}else if("edit"===I.operateType){let a={};a=q?{uuid:I.nowData.uuid,leaguename:e.leaguename,leaguemode:e.leaguemode,validcount:e.validcount,launchtime:e.launchtime?e.launchtime.format("YYYY-MM-DD"):"",endtime:e.endtime?e.endtime.format("YYYY-MM-DD"):""}:{uuid:I.nowData.uuid,leaguename:e.leaguename,leaguemode:e.leaguemode,validcount:e.validcount};const t=await p.editLeague(a);t&&200===t.code?(d.success("编辑成功"),T(k),L()):d.error((null==t?void 0:t.message)??"编辑失败")}}finally{b({modalLoading:!1})}},onCancel:()=>L(),confirmLoading:I.modalLoading,children:t.jsxs(n,{form:y,labelCol:{span:6},children:[t.jsx(n.Item,{label:"联赛名称",name:"leaguename",rules:[{required:!0,whitespace:!0,message:"请输入联赛名称"},{max:7,message:"最多输入7位字符"}],children:t.jsx(o,{style:{width:"300px"},placeholder:"请输入"})}),t.jsx(n.Item,{name:"leaguemode",label:"积分方式",rules:[{required:!0,message:"请选择积分方式"}],children:t.jsx(h,{style:{width:"300px"},placeholder:"请选择",allowClear:!0,options:O,onChange:e=>{1===e?(E(!1),y.setFieldsValue({launchtime:"",endtime:"",leaguemode:e}),C(e)):(E(!0),y.setFieldsValue({leaguemode:e}),C(e))}})}),t.jsx(n.Item,{label:"统计数量",name:"validcount",rules:[{required:!0,message:"请输入统计数量"}],children:t.jsx(u,{style:{width:"300px"},placeholder:"0~99，代表计多少场积分最高的场次，0代表全部统计",min:0,max:99})}),t.jsx(n.Item,{name:"launchtime",label:"开始时间",dependencies:["endtime"],rules:[{required:0===M,message:"请选择开始日期"},({getFieldValue:e})=>({validator(a,t){const i=e("endtime");return i&&t&&t.isSameOrAfter(i)?Promise.reject(new Error("开始日期必须小于结束日期")):Promise.resolve()}})],hidden:1===M,children:t.jsx(r,{format:"YYYY-MM-DD",style:{width:"300px"}})}),t.jsx(n.Item,{name:"endtime",label:"结束时间",dependencies:["launchtime"],rules:[{required:0==M,message:"请选择结束日期"},({getFieldValue:e})=>({validator(a,t){const i=e("launchtime");return i&&t&&t.isSameOrBefore(i)?Promise.reject(new Error("结束日期必须大于开始日期")):Promise.resolve()}})],hidden:1===M,children:t.jsx(r,{format:"YYYY-MM-DD",style:{width:"300px"}})})]})})]})}export{v as default};
