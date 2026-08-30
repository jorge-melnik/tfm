# Exportar issues a csv
gh project item-list 4 --owner jorge-melnik --format json --limit 1000 > project.json

Crear export.jq con : 
.items
| (map(keys) | add | unique | map(select(. != "content"))) as $project_columns
| (["Número", "Título", "Descripción", "Repositorio", "Tipo", "URL"] + $project_columns) as $columns
| ($columns | @csv),
  (.[] |
    . as $item |
    [
      ($item.content.number // ""),
      ($item.content.title // ""),
      ($item.content.body // ""),
      ($item.content.repository // ""),
      ($item.content.type // ""),
      ($item.content.url // ""),
      (
        $project_columns[] |
        $item[.] |
        if type == "object" or type == "array"
        then tojson
        elif . == null
        then ""
        else .
        end
      )
    ] |
    @csv
  )

jq -r -f export.jq project.json > project.csv







gh api graphql -F query=@export.graphql > project-graphql.json

jq -r -f export.graphql.jq project-graphql.json > project.csv