List<DbTermPath> dbTermPathList = DbTermPath.withCriteria{
    like('pathNames', '%leukem%')
    order("pathNames", "asc")
}
dbTermPathList.each{
    println(it.dbTerm.name)
    println(it.pathNames)
}
null