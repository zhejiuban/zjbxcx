/**
 * 小程序配置文件
 */

// 此处主机域名

var domain = "https://wx.zhejiuban.com";

var prefix = '/api/v1';

var host = domain+prefix;

var config = {
  domain,

  // 下面的地址配合云端 Server 工作
  host,

  //维修人员端获取openID和unionID
  workerLoginUrl: `${host}/worker_login`,

  //判断是否手机号已经授权
  phoneAuthorizeUrl: `${host}/phone_authorize`,

  //获取微信用户绑定的手机号
  findPhoneUrl: `${host}/find_phone`,

  //判断普通用户是否已注册(授权)
  authenticationUrl: `${host}/authentication`,

  //利用资产(或者场地)的org_id查找公司是否需要LDAP验证登录或者系统认证
  needValidationUrl: `${host}/need_validation`,

  jobNumberUrl: `${host}/jobNumber`,

  //添加一个普通用户
  addUserUrl: `${host}/add_user`,

  //判断用户需要何种方式认证(0 无需认证 1 LDAP认证 2 系统认证)
  userAuthUrl: `${host}/user_auth`,

  //普通用户系统认证
  systemAuthUrl: `${host}/system_auth`,

  //普通用户登录获取openID 和 unionID
  loginUrl: `${host}/login`,

  //获取资产详情
  assetFindUrl: `${host}/asset_find`,

  //资产、设备组报修提交报修工单接口
  repairAddUrl: `${host}/repair/add`,

  //场地报修提交工单接口
  areaRepairUrl: `${host}/repair/area_repair`,

  //报修端 工单列表接口
  repairListUrl: `${host}/repair/repair_list`,

  //提交评价信息接口
  evaluateUrl: `${host}/repair/evaluate`,

  //维修端 工单列表接口
  serviceListUrl: `${host}/repair/service_list`,

  //维修人员点击确认接单接口
  confirmRepairUrl: `${host}/repair/confirm_repair`,

  //维修人员签到时间接口
  signTimeUrl: `${host}/repair/sign_time`,

  //维修人员填写维修结果
  writeResultUrl: `${host}/repair/write_result`,

  //维修人员拒绝接单接口
  refuseRepairUrl: `${host}/repair/refuse_repair`,

  //工单全部详情接口
  repairAllInfoUrl: `${host}/repair/repair_all_info`,

  //用户投诉表单提交接口
  complainUrl: `${host}/repair/complain`,

  //用户查看维修日志记录接口
  processLogUrl: `${host}/repair/process_log`,

  //获取指定服务商下的待分派工单接口
  AssignRepairListUrl: `${host}/repair/assign_repair_list`,

  //显示出指定服务商下面的维修人员
  workerListUrl: `${host}/repair/worker_list`,

  //服务商管理员分派维修人员
  assignWorkerUrl: `${host}/repair/assign_worker`,
  
  //维修人员已拒绝的工单
  refuseListUrl: `${host}/repair/refuse_list`,

  //维修人员已拒绝的工单详情
  refuseRepairInfoUrl: `${host}/repair/refuse_repair_info`,

  //场地报修管理接口
  getClassifyUrl: `${host}/area/get_classify`,

  //获取所属单位接口
  getOrgUrl: `${host}/area/get_org`,

  //获取场地详情接口
  getAreaUrl: `${host}/area/get_area`,

  //获取场地详情接口
  findAreaUrl: `${host}/area/find_area`,

  //获取资产详情接口
  findAssetUrl: `${host}/area/find_asset`,

  //设备组详情接口
  findEquipmentUrl: `${host}/find_equipment`,
  
  //资产点检管理
  checkListUrl: `${host}/check/check_list`,
  checkResultUrl: `${host}/check/check_result`,
  assetCheckUrl: `${host}/check/asset_check`,
  checkInfoUrl: `${host}/check/check_info`,
  assetCheckListUrl: `${host}/check/asset_check_list`,

  // 上传图片接口
  imgFileUrl: `${host}/img_file`,
};

module.exports = config