export type TT = {
  field6: any;
  field7: any;
};

export type T = {
  field1: number;
  field2: string;
  field3: number;
  field4: boolean;
  field5: TT;
};

const t: T = {} as any;
t.field1;
t.field2;
t.field3;
t.field4;
var pp = t.field5;
pp.field6;