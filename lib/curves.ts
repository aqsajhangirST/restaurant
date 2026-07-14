import * as THREE from "three";

/**
 * Master camera path for the Scenes 1-4 continuous take (three-scene-plan.md
 * §3 "MasterDollyCamera", §10 "Scene transition mechanics"). Spans Scene 1's
 * resting position through Scene 2's bloom dolly + orbit, Scene 3's crane
 * up through the canopy, and now Scene 4's final descent into a wide
 * establishing shot of the room — where the continuous take ends. Scene 5
 * onward are standard scroll-triggered DOM sections, not more camera-path
 * points, per the architecture's "Scenes 5-13 are standard scroll-triggered
 * content sections" split.
 *
 * Note: CatmullRomCurve3.getPointAt() parameterizes by arc length across
 * the *whole* curve, so appending points here reflows where earlier scenes'
 * progress values land — expected, and why lib/constants.ts's
 * `sceneProgress` numbers get retuned each time a scene is added.
 */
export const masterCameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 5), // Scene 1 resting position
  new THREE.Vector3(0, 0.02, 4.2), // hand-off begins
  new THREE.Vector3(0, 0.05, 3.1), // dolly toward the macro bloom
  new THREE.Vector3(0.55, 0.18, 2.35), // orbit swings right
  new THREE.Vector3(1.05, 0.32, 1.85), // ~15 degrees around, orbit settles
  new THREE.Vector3(1.2, 0.9, 1.4), // Scene 3: crane begins to rise
  new THREE.Vector3(0.9, 1.8, 0.6), // rising further, pulling back toward center
  new THREE.Vector3(0.4, 2.6, -0.3), // higher still, looking up through the canopy
  new THREE.Vector3(0.0, 3.2, -1.0), // crane peak, canopy directly overhead
  new THREE.Vector3(0.3, 2.2, -0.5), // Scene 4: descent begins
  new THREE.Vector3(0.6, 1.2, 0.3), // continuing down and forward
  new THREE.Vector3(0.3, 0.5, 1.6), // settling toward resting height
  new THREE.Vector3(0, 0.4, 2.8), // final wide establishing shot of the room
]);

export const masterLookAtPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0.05, 0),
  new THREE.Vector3(0, 0.1, 0),
  new THREE.Vector3(0.05, 0.15, 0),
  new THREE.Vector3(0.1, 0.18, 0),
  new THREE.Vector3(0.1, 1.0, 0), // begin looking up
  new THREE.Vector3(0.05, 2.0, 0),
  new THREE.Vector3(0, 2.8, 0.2),
  new THREE.Vector3(0, 3.4, 0.4), // looking up into the canopy
  new THREE.Vector3(0, 2.0, 0.5), // begin looking back down and forward
  new THREE.Vector3(0, 1.0, 0.2),
  new THREE.Vector3(0, 0.6, -0.5),
  new THREE.Vector3(0, 0.3, -1.5), // looking into the settled room
]);

/**
 * Where Scene 1's autonomous push-in (plays on load, independent of
 * scroll) hands off to scroll-driven camera motion. Below this, if the
 * user hasn't scrolled yet, autoplay still gently animates the opening
 * push-in; past it, real scroll progress takes over — see CameraRig.
 */
export const AUTOPLAY_PROGRESS_CAP = 0.06;
