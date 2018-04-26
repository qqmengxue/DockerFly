package org.voovan.dockerfly.DataOperate;

import org.voovan.db.JdbcOperate;
import org.voovan.dockerfly.db.DataBaseUtils;
import org.voovan.dockerfly.model.Host;
import org.voovan.dockerfly.model.Registry;
import org.voovan.dockerfly.model.User;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * 类文字命名
 *
 * @author: helyho
 * DockerFly Framework.
 * WebSite: https://github.com/helyho/DockerFly
 * Licence: Apache v2 License
 */
public class OperUser {

    private static String queryFieldList = "UserId, UserName, Role, DefaultHost, Hosts, Registrys, CreateDate";

    private static String addUser = "insert into df_user (UserName, Password, Role, DefaultHost, Hosts, Registrys)\n" +
            "select ::userName, ::password, ::role, ::defaultHost, ::hosts, ::registrys";
    private static String delUser = "delete from df_user where userId = ::1";
    private static String getUser = "select "+queryFieldList+" from df_user where UserId=::1";
    private static String getUserList = "select "+queryFieldList+" from df_user";
    private static String checkUser = "select "+queryFieldList+" from df_user where UserName=::1 and Password=::2";
    private static String modifyPassword = "update DF_USER set password =::2 where userId=::1";
    private static String modifyHosts = "update DF_USER set hosts =::2 where userId=::1";
    private static String modifyDefaultHost = "update DF_USER set DefaultHost =::2 where userId=::1";
    private static String modifyRegistrys = "update DF_USER set registrys =::2 where userId=::1";

    /**
     * 修改用户密码
     * @param userId 用户ID
     * @param password 密码
     * @return true: 成功, false: 失败
     * @throws SQLException SQL异常
     */
    public static boolean modifyPassword(int userId, String password ) throws SQLException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        int count = jdbcOperate.update(modifyPassword, userId, password);
        if(count==0){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 修改Registry信息
     * @param userId 用户ID
     * @param registrys 主机信息
     * @return true: 成功, false: 失败
     * @throws SQLException SQL异常
     */
    public static boolean modifyRegistrys(int userId, List<Registry> registrys ) throws SQLException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        int count = jdbcOperate.update(modifyRegistrys, userId, registrys);
        if(count==0){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 修改主机信息
     * @param userId 用户ID
     * @param Hosts 主机信息
     * @return true: 成功, false: 失败
     * @throws SQLException SQL异常
     */
    public static boolean modifyHosts(int userId, List<Host> Hosts ) throws SQLException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        int count = jdbcOperate.update(modifyHosts, userId, Hosts);
        if(count==0){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 修改用户密码
     * @param userId 用户ID
     * @param hostId 主机序号
     * @return true: 成功, false: 失败
     * @throws SQLException SQL异常
     */
    public static boolean modifyDefaultHost(int userId, int hostId ) throws SQLException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        int count = jdbcOperate.update(modifyDefaultHost, userId, hostId);
        if(count==0){
            return false;
        }else{
            return true;
        }
    }


    /**
     * 新增用户
     * @param user 用户信息
     * @return true: 成功, false: 失败
     * @throws SQLException
     * @throws ReflectiveOperationException
     */
    public static boolean addUser(User user) throws SQLException, ReflectiveOperationException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        int count = jdbcOperate.update(addUser, user);
        if(count==0){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 删除用户
     * @param userId 用户ID
     * @return true: 成功, false: 失败
     * @throws SQLException
     * @throws ReflectiveOperationException
     */
    public static boolean delUser(int userId) throws SQLException, ReflectiveOperationException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        int count = jdbcOperate.update(delUser, userId);
        if(count==0){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 查询用户
     * @param userId 用户ID
     * @return 用户对象
     * @throws ParseException 解析异常
     * @throws SQLException SQL 异常
     * @throws ReflectiveOperationException 反射异常
     */
    public static User getUser(int userId) throws ParseException, SQLException, ReflectiveOperationException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        User user = jdbcOperate.queryObject(getUser, User.class, userId);
        return user;
    }

    /**
     *  用户登录
     * @param userName 用户名
     * @param password 密码
     * @return 用户对象
     * @throws SQLException SQL 异常
     */
    public static User checkUser(String userName, String password) throws SQLException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        return jdbcOperate.queryObject(checkUser, User.class, userName, password);
    }

    /**
     * 获取用户
     * @return 返回用户列表
     * @throws SQLException SQL 异常
     */
    public static List<User> getUserList() throws SQLException {
        JdbcOperate jdbcOperate = DataBaseUtils.getOperator();
        return jdbcOperate.queryObjectList(getUserList, User.class);
    }


    public static void main(String[] args) throws Exception {
        DataBaseUtils.initDataBase();
        User userI = new User();
        userI.setUserName("test");
        userI.setPassword("654321");
        userI.setDefaultHost(0);
        userI.getHosts().add(new Host("default","127.0.0.1",2735));
        userI.getHosts().add(new Host("vm","10.0.0.102",2736));
        OperUser.addUser(userI);
        User suser = OperUser.getUser(1);
        User cuser = OperUser.checkUser("helyho","1234567");
        List<User> userList = OperUser.getUserList();
        OperUser.modifyPassword(2,"1234");
        OperUser.modifyHosts(2,userI.getHosts());
    }
}
