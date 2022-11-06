
enum Corenumber {
  one_ground,
  two_ground,
  three_ground,
  four_ground,
  five_ground,
  four_by_two_ground,
  eight_by_two_ground,

}


export let Corenumbers: Array<string> = new Array<string>();

for (let i = 0; ; i++) {

  const corenumber: string = Corenumber[i];
  if (corenumber == null||corenumber==""||corenumber==undefined) {
    break;
  }

  Corenumbers.push(corenumber);

}
