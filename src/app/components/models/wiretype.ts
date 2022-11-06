enum WireType {

  audio,
  video

}

export let Wiretypes: Array<string> = new Array<string>();

for (let i = 0; ; i++) {

  const wiretype: string = WireType[i];

  if (wiretype == null || wiretype == "" || wiretype == undefined) {
    break;
  }

  Wiretypes.push(wiretype);


}
