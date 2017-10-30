import org.hibernate.FetchMode as FM

def c = DbTerm.createCriteria()
List<DbTerm> dbTermList = c.list(max:10){    
    dbTermPaths {
        like('pathNames', '%limbs%')
        order("pathNames", "asc")
    }
    fetchMode("dbTermPaths", FM.JOIN)
}


dbTermList.each{
    //println(it.name)
    for(DbTermPath dbTermPath in it.dbTermPaths){
    println(dbTermPath.pathNames)
    }
}
null