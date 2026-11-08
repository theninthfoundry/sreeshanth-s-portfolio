const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const one = selector => document.querySelector(selector);
const viewer=one('#viewer');
let items=[], position=0, collectionName='';
function displayArtwork(){
  const item=items[position];
  one('#viewer-title').textContent=item.label;
  one('#view-art').src=item.src;
  one('#view-art').alt=item.label;
  one('#view-count').textContent=items.length===1?collectionName:collectionName+' / '+(position+1)+' of '+items.length;
  one('#view-controls').hidden=items.length<2;
}
function openArtwork(images,start,name){
  items=images;position=start;collectionName=name;
  displayArtwork();view
// zoom controls
