/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

// var host = "wx.zhejiuban.com/wx";

var domain = "wx.zhejiuban.com";

var prefix = '/api/v1';

var host = domain+prefix;

// var host = "wx.zhejiuban.com/wx"

var config = {

  // 下面的地址配合云端 Server 工作
  host,

  //维修人员端获取openID和unionID
  workerLoginUrl: `https://${host}/worker_login`,

  //判断是否手机号已经授权
  phoneAuthorizeUrl: `https://${host}/phone_authorize`,

  //获取微信用户绑定的手机号
  findPhoneUrl: `https://${host}/find_phone`,

  //判断普通用户是否已注册(授权)
  authenticationUrl: `https://${host}/authentication`,

  //利用资产(或者场地)的org_id查找公司是否需要LDAP验证登录或者系统认证
  needValidationUrl: `https://${host}/need_validation`,

  jobNumberUrl: `https://${host}/jobNumber`,

  //添加一个普通用户
  addUserUrl: `https://${host}/add_user`,

  //判断用户需要何种方式认证(0 无需认证 1 LDAP认证 2 系统认证)
  userAuthUrl: `https://${host}/user_auth`,

  //普通用户系统认证
  systemAuthUrl: `https://${host}/system_auth`,

  //普通用户登录获取openID 和 unionID
  loginUrl: `https://${host}/login`,

  //获取资产详情
  assetFindUrl: `https://${host}/asset_find`,

  // assetUrl: `https://${host}/asset`,

  //资产、设备组报修提交报修工单接口
  repairAddUrl: `https://${host}/repair/add`,

  //场地报修提交工单接口
  areaRepairUrl: `https://${host}/repair/area_repair`,

  //报修端 工单列表接口
  repairListUrl: `https://${host}/repair/repair_list`,

  //提交评价信息接口
  evaluateUrl: `https://${host}/repair/evaluate`,

  //维修端 工单列表接口
  serviceListUrl: `https://${host}/repair/service_list`,

  //维修人员点击确认接单接口
  confirmRepairUrl: `https://${host}/repair/confirm_repair`,

  //维修人员签到时间接口
  signTimeUrl: `https://${host}/repair/sign_time`,

  //维修人员填写维修结果
  writeResultUrl: `https://${host}/repair/write_result`,

  //维修人员拒绝接单接口
  refuseRepairUrl: `https://${host}/repair/refuse_repair`,

  //工单全部详情接口
  repairAllInfoUrl: `https://${host}/repair/repair_all_info`,

  //用户投诉表单提交接口
  complainUrl: `https://${host}/repair/complain`,

  //用户查看维修日志记录接口
  processLogUrl: `https://${host}/repair/process_log`,

  //获取指定服务商下的待分派工单接口
  AssignRepairListUrl: `https://${host}/repair/assign_repair_list`,

  //显示出指定服务商下面的维修人员
  workerListUrl: `https://${host}/repair/worker_list`,

  //服务商管理员分派维修人员
  assignWorkerUrl: `https://${host}/repair/assign_worker`,
  
  //维修人员已拒绝的工单
  refuseListUrl: `https://${host}/repair/refuse_list`,

  //维修人员已拒绝的工单详情
  refuseRepairInfoUrl: `https://${host}/repair/refuse_repair_info`,

  //场地报修管理接口
  getClassifyUrl: `https://${host}/area/get_classify`,

  //获取所属单位接口
  getOrgUrl: `https://${host}/area/get_org`,

  //获取场地详情接口
  getAreaUrl: `https://${host}/area/get_area`,

  //获取场地详情接口
  findAreaUrl: `https://${host}/area/find_area`,

  //获取资产详情接口
  findAssetUrl: `https://${host}/area/find_asset`,

  //设备组详情接口
  findEquipmentUrl: `https://${host}/find_equipment`,
  
  //资产点检管理
  checkListUrl: `https://${host}/check/check_list`,
  checkResultUrl: `https://${host}/check/check_result`,
  assetCheckUrl: `https://${host}/check/asset_check`,
  checkInfoUrl: `https://${host}/check/check_info`,
  assetCheckListUrl: `https://${host}/check/asset_check_list`,

  // 上传图片接口
  imgFileUrl: `https://${host}/img_file`,
};

module.exports = config