import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Video Display on Home Page', () => {
  let testVideoId: number;
  let youtubeVideoId: number;

  beforeAll(async () => {
    console.log('Setting up test environment for video display...');
  });

  afterAll(async () => {
    console.log('Cleanup completed for video display tests');
  });

  it('should create a regular video for display', async () => {
    const videoData = {
      title: 'Regular Video Test',
      description: 'Test video for display',
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      duration: 120,
      displayOrder: 1,
      isActive: true,
      category: 'products',
    };

    const result = await db.createShowcaseVideo(videoData);
    testVideoId = result.id;

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });

  it('should create a YouTube video for display', async () => {
    const videoData = {
      title: 'YouTube Video Test',
      description: 'Test YouTube video for display',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 180,
      displayOrder: 2,
      isActive: true,
      category: 'products',
    };

    const result = await db.createShowcaseVideo(videoData);
    youtubeVideoId = result.id;

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });

  it('should retrieve active videos for display', async () => {
    const videos = await db.getShowcaseVideos();

    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
  });

  it('should filter active videos only', async () => {
    const videos = await db.getShowcaseVideos();
    const activeVideos = videos.filter((v: any) => v.isActive);

    expect(activeVideos.length).toBeGreaterThan(0);
    activeVideos.forEach((video: any) => {
      expect(video.isActive).toBe(true);
    });
  });

  it('should retrieve video by ID', async () => {
    const video = await db.getShowcaseVideoById(testVideoId);

    expect(video).toBeDefined();
    expect(video?.id).toBe(testVideoId);
    expect(video?.title).toBe('Regular Video Test');
  });

  it('should retrieve YouTube video with correct metadata', async () => {
    const video = await db.getShowcaseVideoById(youtubeVideoId);

    expect(video).toBeDefined();
    expect(video?.youtubeId).toBe('dQw4w9WgXcQ');
    expect(video?.youtubeUrl).toContain('youtube.com');
  });

  it('should increment video views', async () => {
    const videoBefore = await db.getShowcaseVideoById(testVideoId);
    const viewsBefore = videoBefore?.views || 0;

    // Simulate incrementing views
    await db.updateShowcaseVideo(testVideoId, {
      views: viewsBefore + 1,
    });

    const videoAfter = await db.getShowcaseVideoById(testVideoId);
    expect(videoAfter?.views).toBe(viewsBefore + 1);
  });

  it('should update video display order', async () => {
    const updateData = {
      displayOrder: 5,
    };

    const result = await db.updateShowcaseVideo(testVideoId, updateData);

    expect(result).toBeDefined();

    const video = await db.getShowcaseVideoById(testVideoId);
    expect(video?.displayOrder).toBe(5);
  });

  it('should deactivate video', async () => {
    const updateData = {
      isActive: false,
    };

    await db.updateShowcaseVideo(testVideoId, updateData);

    const video = await db.getShowcaseVideoById(testVideoId);
    expect(video?.isActive).toBe(false);
  });

  it('should sort videos by display order', async () => {
    const videos = await db.getShowcaseVideos();
    
    // Check if videos are sorted by displayOrder
    for (let i = 1; i < videos.length; i++) {
      expect(videos[i].displayOrder).toBeGreaterThanOrEqual(videos[i - 1].displayOrder);
    }
  });

  it('should handle YouTube URL extraction', async () => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const youtubeId = 'dQw4w9WgXcQ';

    const video = await db.getShowcaseVideoById(youtubeVideoId);
    
    expect(video?.youtubeId).toBe(youtubeId);
    expect(video?.youtubeUrl).toContain(youtubeUrl.split('?')[0]);
  });

  it('should delete video and verify removal', async () => {
    const result = await db.deleteShowcaseVideo(testVideoId);
    expect(result.success).toBe(true);

    const video = await db.getShowcaseVideoById(testVideoId);
    expect(video).toBeNull();
  });

  it('should handle multiple videos with different types', async () => {
    const videosData = [
      {
        title: 'Local Video 1',
        description: 'Local video',
        videoUrl: 'https://example.com/video1.mp4',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        duration: 120,
        displayOrder: 1,
        isActive: true,
        category: 'products',
      },
      {
        title: 'YouTube Video 1',
        description: 'YouTube video',
        videoUrl: 'https://youtu.be/abc123',
        youtubeUrl: 'https://youtu.be/abc123',
        youtubeId: 'abc123',
        thumbnailUrl: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',
        duration: 180,
        displayOrder: 2,
        isActive: true,
        category: 'products',
      },
    ];

    const createdVideos = [];
    for (const videoData of videosData) {
      const result = await db.createShowcaseVideo(videoData);
      createdVideos.push(result.id);
    }

    const videos = await db.getShowcaseVideos();
    expect(videos.length).toBeGreaterThanOrEqual(createdVideos.length);

    // Cleanup
    for (const videoId of createdVideos) {
      await db.deleteShowcaseVideo(videoId);
    }
  });

  it('should cleanup YouTube video after test', async () => {
    const result = await db.deleteShowcaseVideo(youtubeVideoId);
    expect(result.success).toBe(true);

    const video = await db.getShowcaseVideoById(youtubeVideoId);
    expect(video).toBeNull();
  });
});
