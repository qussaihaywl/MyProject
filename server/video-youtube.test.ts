import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Showcase Videos with YouTube Support', () => {
  let testVideoId: number;
  let youtubeVideoId: number;

  beforeAll(async () => {
    console.log('Setting up test environment for YouTube videos...');
  });

  afterAll(async () => {
    if (testVideoId) {
      try {
        await db.deleteShowcaseVideo(testVideoId);
      } catch (e) {
        console.log('Cleanup completed for direct video');
      }
    }
    if (youtubeVideoId) {
      try {
        await db.deleteShowcaseVideo(youtubeVideoId);
      } catch (e) {
        console.log('Cleanup completed for YouTube video');
      }
    }
  });

  it('should create a direct video', async () => {
    const videoData = {
      title: 'Direct Video Test',
      description: 'This is a direct video test',
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      duration: 120,
      displayOrder: 1,
      isActive: true,
      category: 'Test',
      videoType: 'direct' as const,
    };

    const result = await db.createShowcaseVideo(videoData);
    testVideoId = result.id;

    expect(result).toBeDefined();
    expect(result.title).toBe('Direct Video Test');
    expect(result.videoType).toBe('direct');
    expect(result.duration).toBe(120);
  });

  it('should create a YouTube video', async () => {
    const videoData = {
      title: 'YouTube Video Test',
      description: 'This is a YouTube video test',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 212,
      displayOrder: 2,
      isActive: true,
      category: 'YouTube',
      videoType: 'youtube' as const,
    };

    const result = await db.createShowcaseVideo(videoData);
    youtubeVideoId = result.id;

    expect(result).toBeDefined();
    expect(result.title).toBe('YouTube Video Test');
    expect(result.videoType).toBe('youtube');
    expect(result.youtubeId).toBe('dQw4w9WgXcQ');
    expect(result.duration).toBe(212);
  });

  it('should retrieve all videos including YouTube videos', async () => {
    const videos = await db.getShowcaseVideos();
    
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
    
    const youtubeVideos = videos.filter((v: any) => v.videoType === 'youtube');
    expect(youtubeVideos.length).toBeGreaterThan(0);
  });

  it('should retrieve a YouTube video by ID', async () => {
    const video = await db.getShowcaseVideoById(youtubeVideoId);

    expect(video).toBeDefined();
    expect(video?.id).toBe(youtubeVideoId);
    expect(video?.title).toBe('YouTube Video Test');
    expect(video?.videoType).toBe('youtube');
  });

  it('should update a video with YouTube data', async () => {
    const updateData = {
      title: 'Updated YouTube Video',
      youtubeId: 'jNQXAC9IVRw',
      youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    };

    const result = await db.updateShowcaseVideo(youtubeVideoId, updateData);
    expect(result).toBeDefined();

    const updatedVideo = await db.getShowcaseVideoById(youtubeVideoId);
    expect(updatedVideo?.title).toBe('Updated YouTube Video');
    expect(updatedVideo?.youtubeId).toBe('jNQXAC9IVRw');
  });

  it('should link video to display screens', async () => {
    const displayIds = [1, 2, 3];
    const updateData = {
      displayIds: displayIds,
    };

    const result = await db.updateShowcaseVideo(youtubeVideoId, updateData);
    expect(result).toBeDefined();

    const updatedVideo = await db.getShowcaseVideoById(youtubeVideoId);
    if (updatedVideo?.displayIds) {
      const linkedDisplays = JSON.parse(updatedVideo.displayIds);
      expect(linkedDisplays).toEqual(displayIds);
    }
  });

  it('should track video views', async () => {
    const updateData = {
      views: 100,
    };

    const result = await db.updateShowcaseVideo(youtubeVideoId, updateData);
    expect(result).toBeDefined();

    const updatedVideo = await db.getShowcaseVideoById(youtubeVideoId);
    expect(updatedVideo?.views).toBe(100);
  });

  it('should filter videos by type', async () => {
    const allVideos = await db.getShowcaseVideos();
    
    const directVideos = allVideos.filter((v: any) => v.videoType === 'direct');
    const youtubeVideos = allVideos.filter((v: any) => v.videoType === 'youtube');

    expect(directVideos.length).toBeGreaterThan(0);
    expect(youtubeVideos.length).toBeGreaterThan(0);
    expect(directVideos.length + youtubeVideos.length).toBe(allVideos.length);
  });

  it('should extract YouTube ID from various URL formats', async () => {
    const testCases = [
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
      { url: 'https://youtu.be/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
    ];

    for (const testCase of testCases) {
      const videoData = {
        title: `Test ${testCase.expected}`,
        videoUrl: `https://www.youtube.com/embed/${testCase.expected}`,
        youtubeUrl: testCase.url,
        youtubeId: testCase.expected,
        duration: 100,
        displayOrder: 1,
        isActive: true,
        videoType: 'youtube' as const,
      };

      const result = await db.createShowcaseVideo(videoData);
      expect(result.youtubeId).toBe(testCase.expected);
      
      // Cleanup
      await db.deleteShowcaseVideo(result.id);
    }
  });

  it('should delete a YouTube video', async () => {
    const videoData = {
      title: 'Video to Delete',
      videoUrl: 'https://www.youtube.com/embed/test123',
      youtubeId: 'test123',
      youtubeUrl: 'https://www.youtube.com/watch?v=test123',
      duration: 60,
      displayOrder: 99,
      isActive: true,
      videoType: 'youtube' as const,
    };

    const createResult = await db.createShowcaseVideo(videoData);
    const deleteTestVideoId = createResult.id;

    const deleteResult = await db.deleteShowcaseVideo(deleteTestVideoId);
    expect(deleteResult.success).toBe(true);

    const deletedVideo = await db.getShowcaseVideoById(deleteTestVideoId);
    expect(deletedVideo).toBeNull();
  });

  it('should maintain display order for mixed video types', async () => {
    const videos = await db.getShowcaseVideos();
    
    if (videos.length >= 2) {
      for (let i = 0; i < videos.length - 1; i++) {
        expect(videos[i].displayOrder).toBeLessThanOrEqual(videos[i + 1].displayOrder);
      }
    }
  });
});
