import { useState, useMemo, useCallback } from "react";
import CollectibleToken from "./CollectibleToken";
import HeartModel from "./HeartModel";
import { Text } from "@react-three/drei";

interface CollectibleData {
  id: string;
  position: [number, number, number];
  type: 'coin' | 'nft' | 'gem';
}

export default function CollectibleSystem() {
  // Pre-calculated collectible positions throughout the scene
  const collectibles: CollectibleData[] = useMemo(() => [
    // Around space station
    { id: 'coin-1', position: [3, 4, 2], type: 'coin' },
    { id: 'coin-2', position: [-3, 2, 4], type: 'coin' },
    { id: 'coin-3', position: [2, -1, -3], type: 'coin' },
    
    // Near navigation portals
    { id: 'gem-1', position: [8, 4, 2], type: 'gem' },
    { id: 'gem-2', position: [-8, 3, 3], type: 'gem' },
    { id: 'gem-3', position: [2, 4, 8], type: 'gem' },
    { id: 'gem-4', position: [-1, 3, -8], type: 'gem' },
    
    // Hidden NFTs in more obscure locations
    { id: 'nft-1', position: [12, 6, -8], type: 'nft' },
    { id: 'nft-2', position: [-15, 2, 10], type: 'nft' },
    { id: 'nft-3', position: [5, -3, 12], type: 'nft' },
    
    // Additional coins
    { id: 'coin-4', position: [0, 8, 0], type: 'coin' },
    { id: 'coin-5', position: [6, 1, -4], type: 'coin' },
    { id: 'coin-6', position: [-4, 5, 1], type: 'coin' },
    { id: 'coin-7', position: [1, 2, 6], type: 'coin' },
    
    // Secret rare NFT in hard to reach place
    { id: 'nft-secret', position: [0, 15, 0], type: 'nft' }
  ], []);

  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  
  const handleCollect = useCallback((id: string) => {
    setCollectedItems(prev => new Set(Array.from(prev).concat(id)));
  }, []);

  // Calculate collection stats
  const stats = useMemo(() => {
    const collected = collectedItems.size;
    const total = collectibles.length;
    const coins = collectibles.filter(c => c.type === 'coin' && collectedItems.has(c.id)).length;
    const gems = collectibles.filter(c => c.type === 'gem' && collectedItems.has(c.id)).length;
    const nfts = collectibles.filter(c => c.type === 'nft' && collectedItems.has(c.id)).length;
    
    const points = coins * 10 + gems * 25 + nfts * 50;
    
    return { collected, total, coins, gems, nfts, points };
  }, [collectibles, collectedItems]);

  return (
    <>
      {/* Render all collectible tokens */}
      {collectibles.map((collectible) => (
        <CollectibleToken
          key={collectible.id}
          position={collectible.position}
          type={collectible.type}
          isCollected={collectedItems.has(collectible.id)}
          onCollect={() => handleCollect(collectible.id)}
        />
      ))}

      {/* Collection progress display */}
      {stats.collected > 0 && (
        <group position={[0, 10, 0]}>
          <Text
            fontSize={0.4}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            🏆 COLLECTION PROGRESS
          </Text>
          
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            {stats.collected}/{stats.total} items found
          </Text>
          
          <Text
            position={[0, -1, 0]}
            fontSize={0.2}
            color="#4fd1c7"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            💰 {stats.coins} coins • 💎 {stats.gems} gems • 🎨 {stats.nfts} NFTs
          </Text>
          
          <Text
            position={[0, -1.4, 0]}
            fontSize={0.2}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            Total Score: {stats.points} points
          </Text>
        </group>
      )}

      {/* Easter egg message for collecting all items */}
      {stats.collected === stats.total && (
        <group position={[0, 8, 0]}>
          <Text
            fontSize={0.5}
            color="#ff6b6b"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            🎉 MASTER COLLECTOR! 🎉
          </Text>
          
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            You've discovered all hidden treasures in WLSFX!
          </Text>
          
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.2}
            color="#9f7aea"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            Secret achievement unlocked: True Explorer
          </Text>
        </group>
      )}

      {/* Hint for first-time visitors */}
      {stats.collected === 0 && (
        <Text
          position={[0, -8, 0]}
          fontSize={0.2}
          color="#4fd1c7"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          💡 Explore the space to find hidden collectibles!
        </Text>
      )}

      {/* Special GLTF Heart Model Easter Egg */}
      {stats.collected >= 5 && (
        <HeartModel
          position={[0, 12, 0]}
          scale={0.5}
          color="#ff6b6b"
        />
      )}
    </>
  );
}