package hpo.api.db.utils

import grails.gorm.transactions.Transactional
import groovy.sql.GroovyRowResult
import groovy.sql.Sql
import org.apache.commons.lang.time.StopWatch
import org.hibernate.SessionFactory
import org.hibernate.internal.SessionImpl

import java.sql.Connection

/**
 * Created by djd on 11/10/17.
 */
@Transactional
class SqlUtilsService {

  SessionFactory sessionFactory
  /**
   * @return a org.groovy.Sql object based on the connection underlying the current session
   */
  Sql getSql() {
    new Sql(getConnection())
  }

  /**
   * @param statement a delete statement to execute
   */
  void executeDetete(String statement) {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    int rowCount = getSql().executeUpdate(statement)
    log.info("${rowCount} rows deleted by statement: ${statement} duration: ${stopWatch} time: ${new Date()}")
  }

  /**
   * @return a Connection with the underlying connection for the active session
   */
  Connection getConnection() {
    SessionImpl sessionImpl = sessionFactory.currentSession as SessionImpl
    sessionImpl.connection()
  }

  /**
   * It executes the given a query and parameters with a sql connection
   * @param sql
   * @param params
   * @return List of returned rows (GroovyRowResult)
   */
  List<GroovyRowResult> executeQuery (String sql, List<Object> params){
    final List<GroovyRowResult> rows = getSql().rows(sql, params)
    rows
  }
}
