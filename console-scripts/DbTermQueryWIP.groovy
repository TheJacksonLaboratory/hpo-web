List<DbTerm> dbTermList = DbTerm.withCriteria{
    like('name', '%limbs%')
    dbTermPaths {
        order("path", "asc")
    }
}
dbTermList.each{
    println(it.name)
    for(DbTermPath dbTermPath in it.dbTermPaths){
        //println(dbTermPath.path)
    }
}
null