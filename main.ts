import {
  createProjectSync,
  ts,
} from "./vendor/deno.land/x/ts_morph@15.1.0/bootstrap/mod.ts";

export function getFieldsUsed(script: string): string[] {
  const project = createProjectSync();
  const sourceFile = project.createSourceFile("file.ts", script);
  const languageService = project.getLanguageService();
  const animalType = sourceFile.statements[0] as ts.TypeAliasDeclaration;
  const animalObjectType = animalType.type as ts.TypeLiteralNode;

  let fields = [];
  for (const member of animalObjectType.members) {
    if (ts.isPropertySignature(member)) {
      const findResult = languageService.findReferences(
        sourceFile.fileName,
        member.name.getStart(sourceFile),
      );
      const references = (findResult ?? [])
        .reduce<ts.ReferencedSymbolEntry[]>(
          (a, b) => a.concat(b.references),
          [],
        )
        .filter((r) => !r.isDefinition);
      if (references.length > 0) {
        fields.push(member.name.getText(sourceFile));
      }
    }
  }

  return fields;
}

if (import.meta.main) {
  const script = await Deno.readTextFile("./test_script.ts");
  let fields = getFieldsUsed(script);
  console.log("%cscript to analyze", "color: green");
  console.log(script);
  console.log("%cfind usage fileds of filed5 of type T", "color: green");
  console.log(`%c${fields}`, "color: blue");
}
