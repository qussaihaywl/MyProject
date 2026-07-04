import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Showcase Videos', () => {
  let testVideoId: number;

  beforeAll(async () => {
    console.log('Setting up test environment...');
  });

  afterAll(async () => {
    if (testVideoId) {
      try {
        await db.deleteShowcaseVideo(testVideoId);
      } catch (e) {
        console.log('Cleanup completed');
      }
    }
  });

  it('should create a showcase video', async () => {
    const videoData = {
      title: 'Test Video',
      description: 'This is a test video',
      videoUrl: 'https://example.com/test.mp4',
      thumbnailUrl: 'https://example.com/test.jpg',
      duration: 60,
      displayOrder: 1,
      isActive: true,
      category: 'Test Category',
    };

    const result = await db.createShowcaseVideo(videoData);
    testVideoId = result.id;

    expect(result).toBeDefined();
    expect(result.title).toBe('Test Video');
    expect(result.duration).toBe(60);
  });

  it('should retrieve all showcase videos', async () => {
    const videos = await db.getShowcaseVideos();
    
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
  });

  it('should retrieve a showcase video by ID', async () => {
    const video = await db.getShowcaseVideoById(testVideoId);

    expect(video).toBeDefined();
    expect(video?.id).toBe(testVideoId);
    expect(video?.title).toBe('Test Video');
  });

  it('should update a showcase video', async () => {
    const videoData = {
      title: 'Test Video Update',
      description: 'This is an update test video',
      videoUrl: 'https://example.com/test-update.mp4',
      thumbnailUrl: 'https://example.com/test-update.jpg',
      duration: 120,
      displayOrder: 5,
      isActive: true,
      category: 'Update Test',
    };
    const createResult = await db.createShowcaseVideo(videoData);
    const updateTestVideoId = createResult.id;

    const updateData = {
      title: 'Updated Test Video',
      description: 'Updated description',
      duration: 150,
    };

    const updateResult = await db.updateShowcaseVideo(updateTestVideoId, updateData);
    expect(updateResult).toBeDefined();

    const updatedVideo = await db.getShowcaseVideoById(updateTestVideoId);
    expect(updatedVideo?.title).toBe('Updated Test Video');
    expect(updatedVideo?.duration).toBe(150);
    
    await db.deleteShowcaseVideo(updateTestVideoId);
  });

  it('should reorder showcase videos', async () => {
    const videos = await db.getShowcaseVideos();
    
    if (videos.length >= 2) {
      const reorderData = [
        { id: videos[0].id, displayOrder: 100 },
        { id: videos[1].id, displayOrder: 200 },
      ];

      const result = await db.reorderShowcaseVideos(reorderData);
      expect(result.success).toBe(true);
    }
  });

  it('should delete a showcase video', async () => {
    const videoData = {
      title: 'Test Video to Delete',
      description: 'This video will be deleted',
      videoUrl: 'https://example.com/delete.mp4',
      thumbnailUrl: 'https://example.com/delete.jpg',
      duration: 60,
      displayOrder: 99,
      isActive: true,
      category: 'Delete Test',
    };
    const createResult = await db.createShowcaseVideo(videoData);
    const deleteTestVideoId = createResult.id;

    const deleteResult = await db.deleteShowcaseVideo(deleteTestVideoId);
    expect(deleteResult.success).toBe(true);

    const deletedVideo = await db.getShowcaseVideoById(deleteTestVideoId);
    expect(deletedVideo).toBeNull();
  });
});
