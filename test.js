//Find all the pairs of items in a distinct integer array that are delta apart

let example1 = [1, 2, 4, 7, 8, 10];
let example2 = [1, 2, 4, 3, 6, 9, 7, 15, 13];

//brute force:
//  loop all items, loop all items looking for pair
function brute(array, delta) {
    console.log('Brute...');
    console.log(`array=${array}`);
    var output = [];
    for (let x = 0; x < array.length; x++) {
        let item1 = array[x];
        for (let y = 0; y < array.length; y++) {
            let item2 = array[y];
            if (item2 - item1 === delta) {
                output.push([item1, item2]);
            }
        }
    }
    let outputString = JSON.stringify(output);
    console.log(`output=${outputString}`);
    return output;
}

brute(example1, 2);
brute(example2, 2);

//what's the O() of brute? O(N squared)
//  I could sort the list first, then I only have to look ahead 
//  and I can quit as soon as I find a pair in that loop

function better1(array, delta) {
    console.log('Better1...');
    console.log(`array=${array}`);
    var output = [];
    let sortedArray = array.sort((a, b) => a - b);//sort ascending
    console.log(`sortedArray=${sortedArray}`);
    //don't need to go to the very end, can't pair last item with anything
    for (let x = 0; x < sortedArray.length - 1; x++) {
        let item1 = array[x];
        //search forward until we find a match or gap is too big
        for (let y = x + 1; y < sortedArray.length; y++) {
            let item2 = array[y];
            if (item2 - item1 === delta) {
                output.push([item1, item2]);
                break;//out of loop y
            } else if (item2 - item1 > delta) {
                break;//out of loop y
            }
        }
    }
    let outputString = JSON.stringify(output);
    console.log(`output=${outputString}`);
    return output;
}

better1(example1, 2);
better1(example2, 2);

//what's the O() of better1? sort takes O(N long N) and my linear search for matching pair is O(N),
//  so this gives O(N * N log N).
//  I know what the next number needs to be, so I could just look for it, the array is sorted after all,
//  - if I didn't do a linear search forward, but did a binary one, that would make it O(N log N * N log N).
//  Finally, if I use a (hash) Map, I eliminate that bottleneck entiry

function optimal(array, delta) {
    console.log('Optimal...');
    console.log(`array=${array}`);
    var output = [];
    let keyvaluePairs = array.map((i) => [i, i]);
    let map = new Map(keyvaluePairs);
    console.log(`map=${JSON.stringify(map)}`);
    //don't need to go to the very end, can't pair last item with anything
    for (let x = 0; x < array.length; x++) {
        let item1 = array[x];
        //find the matching pair
        if (map.get(item1 + delta)) {
            output.push([item1, item1 + delta]);
        }
    }
    console.log(`output=${JSON.stringify(output)}`);
    return output;
}

optimal(example1, 2);
optimal(example2, 2);

//So the O() of optimal is O(N), which I think is OK.

//TESTS:
let assert = require('assert');
describe('optimal', function () {
    //example1 (short, ordered, some pairs, including last)
    it('should find correct pairs for example 1', function() {
        let answer1 = [[2, 4], [8, 10]];
        //acutal, expected
        assert.equal(optimal(example1, 2), answer1);
    })

    //example2 (short, unordered, some pairs, including last)
    it('should find correct pairs for example 1', function() {
        let answer2 = [[1, 3], [2, 4], [4, 6], [7, 9], [13, 15]];
        assert.equal(optimal(example2, 2), answer2);
    })
    //empty array
    //array containing duplicates
    //array already sorted
    //array already sorted descending
    //array with no solutions
    //array with only 1 item
    //array with all solutions
    //very large array
    //array with negative numbers
    //only pair is between last two
    //only pair is between first two
    //delta of 0
    //negative delta
    //very large delta
    //no delta passed in
});
