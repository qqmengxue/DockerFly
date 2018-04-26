/**
 * Created by helyho on 2017/5/4.
 */

function connect(cmd) {
    var user = getUser();
    var host = '127.0.0.1'
    var port = 2735
    var timeout = 15
    var debug = false;

    if(user!=null){
        host = user.hosts[user.defaultHost].ipAddress;
        port = user.hosts[user.defaultHost].port;
        timeout = user.hosts[user.defaultHost].timeout;
        debug = user.hosts[user.defaultHost].debug;
    }

    if(host==null || port == null) {
        cmd.connect();
    }else{
        cmd.connect4(host, port, timeout, debug, "JSON");
    }
}

function getUser(){
    return  getSessionStorage("User");
}

function checkUser(username, password){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var user = operUser.checkUser(username, password);
        operUser.release();
        return user;
    }catch(e){
        alertError(e)
    }
}

function modifyPassword(user, password){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var user = operUser.modifyPassword(user.userId, password);
        operUser.release();
        return user;
    }catch(e){
        alertError(e)
    }
}

function modifyHosts(user){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var user = operUser.modifyHosts(user.userId, user.hosts);
        operUser.release();
        return user;
    }catch(e){
        alertError(e)
    }
}

function modifyRegistrys(user){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var user = operUser.modifyRegistrys(user.userId, user.registrys);
        operUser.release();
        return user;
    }catch(e){
        alertError(e)
    }
}

function modifyDefaultHost(user, defaultHost){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var user = operUser.modifyDefaultHost(user.userId, defaultHost);
        operUser.release();
        return user;
    }catch(e){
        alertError(e)
    }
}

function getUserList(){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var userList = operUser.getUserList();
        operUser.release();
        return userList;
    }catch(e){
        alertError(e)
    }
}

function addUser(user){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var userList = operUser.addUser(user);
        operUser.release();
        return userList;
    }catch(e){
        alertError(e)
    }
}

function delUser(user){
    if(typeof(OperUser)=="undefined") {
        doImport("org.voovan.dockerfly.DataOperate.OperUser")
    }
    try {
        var operUser = new OperUser();
        var userList = operUser.delUser(user.userId);
        operUser.release();
        return userList;
    }catch(e){
        alertError(e)
    }
}

function runCmd(cmdStr){
    if(typeof(CmdExecCreate)=="undefined") {
        doImport("org.voovan.docker.command.Exec.CmdExecCreate")
    }
    if(typeof(CmdExecStart)=="undefined") {
        doImport("org.voovan.docker.command.Exec.CmdExecStart")
    }
    var cmdExecCreate = new CmdExecCreate(this.viewContainer.id);
    connect(cmdExecCreate);
    cmdExecCreate.cmd(cmdStr.split(" "));
    cmdExecCreate.tty(true);
    cmdExecCreate.attachStdin(true);
    var execId = cmdExecCreate.send();
    cmdExecCreate.close();
    cmdExecCreate.release();

    var cmdExecStart = new CmdExecStart(eval("k="+execId).Id);
    cmdExecStart.connect1(60);
    cmdExecStart.tty(true);
    cmdExecStart.send();

    var result;

    while(true){
        result = cmdExecStart.loadStream();
        if(result.length > 0){
            break;
        }
    }
    cmdExecStart.close();
    cmdExecStart.release();
    return result;
}

function getDockerInfo(){
    if(typeof(CmdDockerInfo)=="undefined") {
        doImport("org.voovan.docker.command.Info.CmdDockerInfo")
    }
    try {
        var cmdDockerInfo = new CmdDockerInfo();
        connect(cmdDockerInfo);
        var dockerInfo = cmdDockerInfo.send()
        cmdDockerInfo.close();
        cmdDockerInfo.release();
        return dockerInfo;
    } catch (e) {
        alertError(e)
    }
}

function getDockerFlyConfig(){
    if(typeof(CmdContainerList)=="undefined") {
        doImport("org.voovan.docker.command.CmdDockerFlyConfig")
    }
    try {
        var dockerConfig = null;
        var cmdDockerFlyConfig = new CmdDockerFlyConfig();
        dockerConfig = cmdDockerFlyConfig.config()
        cmdDockerFlyConfig.release();
        return dockerConfig;
    } catch (e) {
        alertError(e)
    }
}


function connectToHost(config){
    if(typeof(CmdContainerList)=="undefined") {
        doImport("org.voovan.docker.command.Info.CmdDockerInfo")
    }
    try{
        var cmdDockerFlyConfig = new CmdDockerFlyConfig();
        if(config.host!="" && config.port!="") {
            cmdDockerFlyConfig.config(config.host, config.port, config.timeout, config.isDebug)
        }else{
            alertError("We need correct data of host and port !")
        }
        cmdDockerFlyConfig.release();
    }catch(e){
        alertError("Need correct host and port data!")
    }
}

function getSwarmInfo(){
    if(typeof(CmdContainerList)=="undefined") {
        doImport("org.voovan.docker.command.Swarm.CmdSwarmInfo")
    }
    try {
        var cmdSwarmInfo = new CmdSwarmInfo();
        connect(cmdSwarmInfo);
        var swarmInfo= cmdSwarmInfo.send()
        cmdSwarmInfo.close();
        cmdSwarmInfo.release();
        return swarmInfo;
    } catch (e) {
        console.log(e)
        return null;
    }
}
//=================== List ===================
function getContainers(){
    if(typeof(CmdContainerList)=="undefined") {
        doImport("org.voovan.docker.command.Container.CmdContainerList")
    }
    try {

        var cmdContainerList = new CmdContainerList();
        connect(cmdContainerList);
        cmdContainerList.all(true)
        var containerList = cmdContainerList.send().sortBy("id", true);
        cmdContainerList.close();
        cmdContainerList.release();
        return containerList;
    } catch (e) {
        alertError(e)
    }
}

function getServices(serviceId){
    if(typeof(CmdServiceList)=="undefined") {
        doImport("org.voovan.docker.command.Service.CmdServiceList")
    }
    try {
        var cmdServiceList = new CmdServiceList();
        if(serviceId!=null){
            cmdServiceList.id([serviceId])
        }
        connect(cmdServiceList);
        var serviceList = cmdServiceList.send().sortBy("id", true);

        cmdServiceList.close();
        cmdServiceList.release();
        return serviceList;
    } catch (e) {
        alertError(e)
    }
}

function getTaskList(serviceId){
    if(typeof(CmdTaskList)=="undefined") {
        doImport("org.voovan.docker.command.Task.CmdTaskList")
    }
    try {
        var cmdTaskList = new CmdTaskList();
        if(serviceId!=null) {
            cmdTaskList.service(serviceId);
        }
        connect(cmdTaskList);
        var taskList = cmdTaskList.send().sortBy("name");
        cmdTaskList.close();
        cmdTaskList.release();
        return taskList;
    } catch (e) {
        alertError(e)
    }
}

function getNodes(){
    if(typeof(CmdNodeList)=="undefined") {
        doImport("org.voovan.docker.command.Node.CmdNodeList")
    }
    try {

        var cmdNodeList = new CmdNodeList();
        connect(cmdNodeList);
        //cmdContainerList.label("author","helyho");
        var nodeList = cmdNodeList.send().sortBy("name");
        cmdNodeList.close();
        cmdNodeList.release();
        return nodeList;
    } catch (e) {
        alertError(e)
    }
}

function getNetworks(){
    if(typeof(CmdNetworkList)=="undefined") {
        doImport("org.voovan.docker.command.Network.CmdNetworkList")
    }
    try {
        var cmdNetworkList = new CmdNetworkList();
        connect(cmdNetworkList);
        var networkList = cmdNetworkList.send().sortBy("name");
        cmdNetworkList.close();
        cmdNetworkList.release();
        return networkList;
    } catch (e) {
        alertError(e)
    }
}

function getImages(){
    if(typeof(CmdImageList)=="undefined") {
        doImport("org.voovan.docker.command.Image.CmdImageList")
    }
    try {
        var cmdImageList = new CmdImageList();
        connect(cmdImageList);
        var imageList = cmdImageList.send().sortBy("Created");
        cmdImageList.close();
        cmdImageList.release();
        return imageList;
    } catch (e) {
        alertError(e)
    }
}

function getVolumes(){
    if(typeof(CmdVolumeList)=="undefined") {
        doImport("org.voovan.docker.command.Volume.CmdVolumeList")
    }
    try {
        var cmdVolumeList = new CmdVolumeList();
        connect(cmdVolumeList)
        var volumeList = cmdVolumeList.send().sortBy("name");
        cmdVolumeList.close();
        cmdVolumeList.release();
        return volumeList;
    } catch (e) {
        alertError(e)
    }
}


//=================== Detail ===================
function getImageDetail(idOrName){
    if(typeof(CmdImageDetail)=="undefined") {
        doImport("org.voovan.docker.command.Image.CmdImageDetail")
    }

    try {
        var cmdImageDetail = new CmdImageDetail(idOrName)
        connect(cmdImageDetail)
        var viewImage = cmdImageDetail.send();
        cmdImageDetail.close();
        cmdImageDetail.release();

        if (viewImage != null) {
            return viewImage;
        } else {
            return null;
        }
    } catch (e) {
        alertError(e)
    }
}

function getContainerDetail(idOrName){
    if(typeof(CmdContainerDetail)=="undefined") {
        doImport("org.voovan.docker.command.Container.CmdContainerDetail")
    }
    try {

        var cmdContainerDetail = new CmdContainerDetail(idOrName)
        connect(cmdContainerDetail)
        var viewContainer = cmdContainerDetail.send();
        cmdContainerDetail.close();
        cmdContainerDetail.release();
        if(viewContainer.hostConfig.cpuPeriod!=0) {
            viewContainer.hostConfig.cpu = viewContainer.hostConfig.cpuQuota / viewContainer.hostConfig.cpuPeriod
        }else{
            viewContainer.hostConfig.cpu = 0;
        }

        return viewContainer;

    } catch (e) {
        alertError(e)
    }
}

function getNetworkDetail(idOrName){
    if(typeof(CmdNetworkDetail)=="undefined") {
        doImport("org.voovan.docker.command.Network.CmdNetworkDetail")
    }
    try {
        var cmdNetworkDetail = new CmdNetworkDetail(idOrName)
        connect(cmdNetworkDetail)
        var viewNetwork = cmdNetworkDetail.send();
        cmdNetworkDetail.close();
        cmdNetworkDetail.release();

        return viewNetwork;
    } catch (e) {
        alertError(e)
    }
}

function getVolumeDetail(idOrName){
    if(typeof(CmdVolumeDetail)=="undefined") {
        doImport("org.voovan.docker.command.Volume.CmdVolumeDetail")
    }
    try {
        var cmdVolumeDetail = new CmdVolumeDetail(idOrName)
        connect(cmdVolumeDetail)
        var viewVolume = cmdVolumeDetail.send();
        cmdVolumeDetail.close();
        cmdVolumeDetail.release();
        return viewVolume;
    } catch (e) {
        alertError(e)
    }
}

//=================== Map ===================
function getContainersIdAndName(){
    var containers = [];
    var containerList = getContainers();
    for(var i=0;i<containerList.length;i++){
        var container = containerList[i];
        containers[container.id] = container.names[0];
    }
    return containers;
}

function getServicesIdAndName(){
    var services = [];
    var serviceList = getServices();
    for(var i=0;i<serviceList.length;i++){
        var service = serviceList[i];
        services[service.id] = service.spec.name;
    }
    return services;
}

function getNodesIdAndName(){
    var nodes = [];
    var nodeList = getNodes();
    for(var i=0;i<nodeList.length;i++){
        var node = nodeList[i];
        var node = nodeList[i];
        nodes[node.id] = {};
        nodes[node.id].name =node.spec.name;
        nodes[node.id].hostname = node.description.hostname;
    }
    return nodes;
}

function getNetworksIdAndName(){
    try {
        var networks = [];
        var networkList = getNetworks();
        for(var i=0;i<networkList.length;i++){
            var network = networkList[i];
            networks[network.id] = network.name;
        }
        return networks;
    } catch (e) {
        alertError(e)
    }
}

function converTask(taskList){

    var containerIdAndNames = getContainersIdAndName();
    var servicesIdAndNames = getServicesIdAndName();
    var nodesIdAndName= getNodesIdAndName();
    for(index in taskList)
    {
        task = taskList[index];

        if(!(task instanceof Function)) {
            task.nodeName = nodesIdAndName[task.nodeId].name;
            task.hostname = nodesIdAndName[task.nodeId].hostname;
            task.serviceName = servicesIdAndNames[task.serviceId];
            if (task.status.containerStatus.containerId != null) {
                task.status.containerStatus.containerName = containerIdAndNames[task.status.containerStatus.containerId];
            }else{
                task.status.containerStatus.containerName = "";
            }
        }
    }

    return taskList;
}